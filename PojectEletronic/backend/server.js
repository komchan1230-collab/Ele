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
const CHANNEL_ACCESS_TOKEN = 'TQvwk7oebF/bEmCjxY6J/DvVHEn7rNpWLitrTbTwRHjbiqTUj74t2eZVTJmsIU9vj2/roTqb2gTiWCzC0jC6anV+gO18MAO8peGL5g66GyNuV5QLlHiM/3ndLx9R+UAvxwmw/hE97krtv6+1cKiHJQdB04t89/1O/w1cDnyilFU='.trim();
const TARGET_GROUP_ID = 'Cd873f437a3bc1690a68bfb17a6c58bbb'; // Group ID ของเจ้าหน้าที่

// ==========================================
// 2. API สำหรับส่งเข้า LINE (แก้ปุ่มให้ส่งค่า action=accept เท่านั้น)
// ==========================================
app.post('/api/admin/line-send', async (req, res) => {
    const { message, reportId, lat, lng } = req.body;
    
    // สร้าง Flex Message
    const flexMessage = {
        type: "flex",
        altText: "มีรายการแจ้งเหตุไฟดับใหม่!",
        contents: {
            type: "bubble",
            header: {
                type: "box", layout: "vertical", backgroundColor: "#ff5e5e",
                contents: [{ type: "text", text: "🔥 แจ้งเหตุไฟดับใหม่", color: "#ffffff", weight: "bold", size: "lg" }]
            },
            body: {
                type: "box", layout: "vertical",
                contents: [
                    { type: "text", text: message, wrap: true, size: "sm", color: "#666666" }
                ]
            },
            footer: {
                type: "box", layout: "vertical", spacing: "sm",
                contents: [
                    // ปุ่มที่ 1: รับเรื่อง (ใช้ postback เพื่อส่งค่าเข้า Server ไม่เปิดลิงก์)
                    {
                        type: "button", style: "primary", color: "#00b900", height: "sm",
                        action: { 
                            type: "postback", 
                            label: "✅ รับเรื่องทันที", 
                            data: `action=accept&id=${reportId}` 
                        }
                    },
                    // ปุ่มที่ 2: ดูแผนที่ (แก้ลิงก์ให้ถูกต้อง)
                    {
                        type: "button", style: "secondary", height: "sm",
                        action: { 
                            type: "uri", 
                            label: "📍 ดูแผนที่", 
                            uri: `https://maps.google.com/?q=${lat},${lng}` 
                        }
                    }
                ]
            }
        }
    };

    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: TARGET_GROUP_ID,
            messages: [flexMessage]
        }, {
            headers: { 'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}` }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Line Send Error:", error.response?.data || error.message);
        res.status(500).json({ success: false });
    }
});

// ==========================================
// 3. API Webhook รับค่าปุ่มกด (แยกเงื่อนไขชัดเจน)
// ==========================================
app.post('/api/line/webhook', async (req, res) => {
    const events = req.body.events;
    if (!events || events.length === 0) return res.sendStatus(200);

    for (const event of events) {
        if (event.type === 'postback') {
            const data = new URLSearchParams(event.postback.data);
            const action = data.get('action');
            const reportId = data.get('id');

            console.log(`Action Received: ${action} for ID: ${reportId}`); // ไว้ดู Log ใน Terminal

            // --- กรณีที่ 1: กดปุ่ม "รับเรื่อง" ---
            if (action === 'accept' && reportId) {
                try {
                    // 1. อัปเดตสถานะเป็น "กำลังดำเนินการ"
                    await db.query('UPDATE reports SET status = ? WHERE id = ?', ['เจ้าหน้าที่รับเรื่องแล้ว', reportId]);
                    
                    // 2. ส่งปุ่ม "ปิดงาน" กลับไปให้เจ้าหน้าที่กดทีหลัง
                    if (event.replyToken) {
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
                                                // ปุ่มนี้ส่ง action=finish
                                                action: { type: "postback", label: "🎉 ซ่อมเสร็จแล้ว / ปิดงาน", data: `action=finish&id=${reportId}` } 
                                            }
                                        ]
                                    }
                                }
                            }]
                        }, { headers: { 'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}` } });
                    }
                } catch (err) { console.error("Accept Error:", err); }
            }

            // --- กรณีที่ 2: กดปุ่ม "ซ่อมเสร็จแล้ว" (ต้องแยก if ออกมาต่างหาก) ---
            else if (action === 'finish' && reportId) {
                try {
                    // อัปเดตสถานะเป็น "เสร็จสิ้น" + บันทึกเวลาจบ (updated_at)
                    await db.query('UPDATE reports SET status = ?, updated_at = NOW() WHERE id = ?', ['แก้ไขเสร็จสิ้นแล้ว', reportId]);
                    
                    if (event.replyToken) {
                        await axios.post('https://api.line.me/v2/bot/message/reply', {
                            replyToken: event.replyToken,
                            messages: [{ type: 'text', text: `🎉 ปิดงาน ID: ${reportId} เรียบร้อย! ขอบคุณครับ` }]
                        }, { headers: { 'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}` } });
                    }
                } catch (err) { console.error("Finish Error:", err); }
            }
        }
    }
    res.sendStatus(200);
});

// 4. API รับข้อมูลแจ้งเหตุ (Frontend) และป้องกันค่า undefined
app.post('/api/reports', upload.array('images'), async (req, res) => {
    // 1. รับค่า location_name เพิ่มเข้ามา
    const { reporter_name, location_name, age, gender, reason, phone, details, latitude, longitude } = req.body;
    const imageUrls = req.files ? req.files.map(f => f.filename).join(',') : '';

    try {
        // 2. เพิ่ม location_name ลงในคำสั่ง SQL INSERT
        const [result] = await db.execute(
            'INSERT INTO reports (reporter_name, location_name, age, gender, reason, phone, details, latitude, longitude, status, images, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                reporter_name || null, 
                location_name || 'ไม่ระบุพิกัด', // <<--- บันทึกชื่อสถานที่ตรงนี้
                age || null, 
                gender || 'ไม่ระบุ', 
                reason || 'ไม่ระบุ', 
                phone || null, 
                details || '', 
                latitude || null, 
                longitude || null, 
                'รอดำเนินการ', 
                imageUrls
            ]
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

// 🔥 7. API สำหรับหน้า "ติดต่อเรา" (บันทึก + แจ้ง LINE)
// 🔥 7. API สำหรับหน้า "ติดต่อเรา" (เพิ่ม email)
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, topic, message } = req.body; // <--- รับ email เพิ่ม

    try {
        // 1. บันทึกลงฐานข้อมูล (เพิ่ม column email)
        await db.execute(
            'INSERT INTO contact_messages (name, email, phone, topic, message) VALUES (?, ?, ?, ?, ?)',
            [name, email || '-', phone, topic, message]
        );

        // 2. ส่งแจ้งเตือนเข้า LINE (เพิ่มบรรทัดแสดงอีเมล)
        if (TARGET_GROUP_ID) {
            const flexMessage = {
                type: "flex",
                altText: "มีข้อความติดต่อใหม่",
                contents: {
                    type: "bubble",
                    body: {
                        type: "box", layout: "vertical",
                        contents: [
                            { type: "text", text: "📩 มีข้อความใหม่ถึงแอดมิน", weight: "bold", color: "#1DB446", size: "sm" },
                            { type: "separator", margin: "md" },
                            { type: "text", text: `หัวข้อ: ${topic}`, weight: "bold", size: "lg", margin: "md", wrap: true },
                            { type: "text", text: `"${message}"`, size: "sm", color: "#666666", wrap: true, margin: "sm" },
                            { type: "separator", margin: "md" },
                            { type: "text", text: `ผู้ติดต่อ: ${name}`, size: "xs", color: "#aaaaaa", margin: "md" },
                            { type: "text", text: `อีเมล: ${email}`, size: "xs", color: "#0000ff", margin: "xs", action: { type: "uri", uri: `mailto:${email}` } }, // <--- กดแล้วเด้งไปหน้าส่งเมลเลย
                            { type: "text", text: `เบอร์โทร: ${phone}`, size: "xs", color: "#aaaaaa", margin: "xs" }
                        ]
                    }
                }
            };

            await axios.post('https://api.line.me/v2/bot/message/push', {
                to: TARGET_GROUP_ID,
                messages: [flexMessage]
            }, {
                headers: { 'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}` }
            });
        }

        res.json({ success: true, message: 'ส่งข้อความสำเร็จ' });
    } catch (err) {
        console.error("Contact Error:", err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    }
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // ตั้งค่ารหัสผ่านตรงนี้ (เปลี่ยนได้ตามใจชอบ)
    const VALID_USER = 'admin';
    const VALID_PASS = '1234'; 

    if (username === VALID_USER && password === VALID_PASS) {
        res.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ' });
    } else {
        res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
});

app.listen(3000, () => console.log('Backend running on https://major-backend-dc3d.onrender.com'));