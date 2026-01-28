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
const CHANNEL_ACCESS_TOKEN = 'LGvc7OMyDD/Kr4dq/QGZN2E5W+UKq/CtEqSEq8cEUkZFfC1iRV2Ts9G+idP5UWVaj2/roTqb2gTiWCzC0jC6anV+gO18MAO8peGL5g66GyOrIYajIX1OXWz6H3vulysxkTDKd1PzSffe7DXrcb6CCgdB04t89/1O/w1cDnyilFU='.trim();

// *** เมื่อคุณพิมพ์ในกลุ่มแล้วได้ Group ID จาก Terminal ให้นำมาวางตรงนี้ ***
// ในไฟล์ server.js
const TARGET_GROUP_ID = 'Cd873f437a3bc1690a68bfb17a6c58bbb'; // วางรหัสที่ได้มาตรงนี้ครับ

// 2. API สำหรับส่ง LINE (เรียกใช้จากหน้า AdminMenu.vue)
app.post('/api/admin/line-send', async (req, res) => {
    const { message } = req.body;
    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: TARGET_GROUP_ID,
            messages: [{ type: 'text', text: message }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
            }
        });
        res.json({ success: true, message: 'ส่งข้อมูลเข้า LINE สำเร็จ' });
    } catch (error) {
        console.error("LINE API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "ส่ง LINE ไม่สำเร็จ ตรวจสอบ Group ID ใน server.js" });
    }
});

// 3. Webhook สำหรับดักจับ Group ID (ดูค่าใน Terminal VS Code)
app.post('/api/line/webhook', (req, res) => {
    const events = req.body.events;
    if (events && events.length > 0) {
        const event = events[0];
        if (event.source && event.source.type === 'group') {
            console.log("-----------------------------------------");
            console.log("พบ Group ID ของคุณ: ", event.source.groupId);
            console.log("-----------------------------------------");
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