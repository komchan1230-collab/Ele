const express = require('express');
const cors = require('cors');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// 1. จัดการโฟลเดอร์เก็บรูปภาพ
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

// --- ส่วนตั้งค่า LINE Messaging API ---
// ใช้ Token ตัวล่าสุดที่คุณส่งมา (ล้างค่าช่องว่างอัตโนมัติ)
const CHANNEL_ACCESS_TOKEN = 'TQvwk7oebF/bEmCjxY6J/DvVHEn7rNpWLitrTbTwRHjbiqTUj74t2eZVTJmsIU9vj2/roTqb2gTiWCzC0jC6anV+gO18MAO8peGL5g66GyNuV5QLlHiM/3ndLx9R+UAvxwmw/hE97krtv6+1cKiHJQdB04t89/1O/w1cDnyilFU='.trim();

// *** เมื่อคุณพิมพ์ในกลุ่มแล้วได้ Group ID จาก Terminal ให้นำมาวางตรงนี้ ***
// ในไฟล์ server.js
const TARGET_GROUP_ID = 'Cd873f437a3bc1690a68bfb17a6c58bbb'; // วางรหัสที่ได้มาตรงนี้ครับ

// 2. API สำหรับส่ง LINE (เรียกใช้จากหน้า AdminMenu.vue)
// แก้ไขเฉพาะก้อนข้อมูล messages ใน server.js
app.post('/api/admin/line-send', async (req, res) => {
   const { message, reportId, lat, lng } = req.body; 

    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: TARGET_GROUP_ID,
            messages: [{
                type: "flex", // เปลี่ยนจาก text เป็น flex
                altText: "มีแจ้งเหตุเข้ามาใหม่! (กรุณาดูในมือถือ)",
                contents: {
                    type: "bubble",
                    body: {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            // ส่วนแสดงข้อความเดิมของคุณ
                            { type: "text", text: message, wrap: true }
                        ]
                    },
                    footer: {
                        type: "box",
                        layout: "vertical",
                        spacing: "sm",
                        contents: [
                            // --- ปุ่มที่ 1: รับเรื่อง (Postback) ---
                            {
                                type: "button",
                                style: "primary",
                                color: "#00b900", // สีเขียว LINE
                                action: {
                                    type: "postback",
                                    label: "✅ รับเรื่องทันที",
                                    // ส่งค่ากลับมาบอก Server ว่าใครกดงาน ID ไหน
                                    data: `action=accept&id=${reportId}` 
                                }
                            },
                            // --- ปุ่มที่ 2: ดูแผนที่ (URI) ---
                            {
                                type: "button",
                                style: "secondary",
                                action: {
                                    type: "uri",
                                    label: "📍 ดูแผนที่",
                                    // ลิงก์ไป Google Maps
                                    uri: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
                                }
                            }
                        ]
                    }
                }
            }]
        }, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}` 
            }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("LINE Error:", error.response?.data || error.message);
        res.status(500).json({ error: "ส่ง LINE ไม่สำเร็จ" });
    }
});

// 3. Webhook สำหรับดักจับ Group ID (ดูค่าใน Terminal VS Code)
// แก้ไข API Webhook ใน server.js
app.post('/api/line/webhook', async (req, res) => {
    const events = req.body.events;
    if (!events || events.length === 0) return res.sendStatus(200);

    for (const event of events) {
        if (event.type === 'postback') {
            const data = new URLSearchParams(event.postback.data);
            const action = data.get('action');
            const reportId = data.get('id');

            // ---------------------------------------------
            // 1. กรณีเจ้าหน้าที่กด "รับเรื่องทันที" (ปุ่มเขียว)
            // ---------------------------------------------
            if (action === 'accept' && reportId) {
                try {
                    // อัปเดตสถานะเป็น "เจ้าหน้าที่รับเรื่องแล้ว"
                    await db.query('UPDATE reports SET status = ? WHERE id = ?', ['เจ้าหน้าที่รับเรื่องแล้ว', reportId]);
                    
                    if (event.replyToken) {
                        // 🔥 ส่งปุ่มใหม่กลับไป: "ซ่อมเสร็จแล้ว"
                        await axios.post('https://api.line.me/v2/bot/message/reply', {
                            replyToken: event.replyToken,
                            messages: [{
                                type: "flex",
                                altText: "กำลังดำเนินการ...",
                                contents: {
                                    type: "bubble",
                                    body: {
                                        type: "box", layout: "vertical",
                                        contents: [
                                            { type: "text", text: `🛠️ รับงาน ID: ${reportId} แล้ว`, weight: "bold", color: "#1DB446", size: "lg" },
                                            { type: "text", text: "เมื่อดำเนินการแก้ไขเสร็จสิ้น กรุณากดปุ่มด้านล่างเพื่อปิดงาน", size: "xs", color: "#aaaaaa", wrap: true, margin: "md" }
                                        ]
                                    },
                                    footer: {
                                        type: "box", layout: "vertical",
                                        contents: [
                                            { 
                                                type: "button", style: "primary", color: "#00b900", height: "sm",
                                                action: { type: "postback", label: "✅ ซ่อมเสร็จแล้ว / ปิดงาน", data: `action=finish&id=${reportId}` } 
                                            }
                                        ]
                                    }
                                }
                            }]
                        }, { headers: { 'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}` } });
                    }
                } catch (err) { console.error(err); }
            }

            // ---------------------------------------------
            // 2. กรณีเจ้าหน้าที่กด "ซ่อมเสร็จแล้ว" (ปุ่มใหม่ที่เราเพิ่งสร้าง)
            // ---------------------------------------------
            if (action === 'finish' && reportId) {
                try {
                    // อัปเดตสถานะเป็น "แก้ไขเสร็จสิ้นแล้ว" -> รายการจะหายไปจากหน้า AreaStatus ทันที
                    await db.query('UPDATE reports SET status = ? WHERE id = ?', ['แก้ไขเสร็จสิ้นแล้ว', reportId]);
                    
                    if (event.replyToken) {
                        await axios.post('https://api.line.me/v2/bot/message/reply', {
                            replyToken: event.replyToken,
                            messages: [{ type: 'text', text: `🎉 ปิดงาน ID: ${reportId} เรียบร้อย! ขอบคุณครับ` }]
                        }, { headers: { 'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}` } });
                    }
                } catch (err) { console.error(err); }
            }
        }
    }
    res.sendStatus(200);
});

// 4. API รับข้อมูลแจ้งเหตุ (Frontend) และป้องกันค่า undefined
app.post('/api/reports', upload.array('images'), async (req, res) => {
    const { reporter_name, age, gender, reason, phone, details, latitude, longitude } = req.body;
    const imageUrls = req.files ? req.files.map(f => f.filename).join(',') : '';

    try {
        const [result] = await db.execute(
            'INSERT INTO reports (reporter_name, age, gender, reason, phone, details, latitude, longitude, status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [reporter_name || null, age || null, gender || 'ไม่ระบุ', reason || 'ไม่ระบุ', phone || null, details || '', latitude || null, longitude || null, 'รอดำเนินการ', imageUrls]
        );
        res.status(201).json({ message: 'บันทึกสำเร็จ', id: result.insertId });
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 5. API อัปเดตสถานะ (Admin)
app.patch('/api/admin/reports/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE reports SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'อัปเดตสถานะสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: 'ไม่สามารถเปลี่ยนสถานะได้' });
    }
});

// 6. ดึงข้อมูลทั้งหมดและลบข้อมูล
app.get('/api/admin/reports', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM reports ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/reports/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM reports WHERE id = ?', [id]);
        res.json({ message: 'ลบข้อมูลสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));