const express = require('express');
const cors = require('cors');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

// 1. ตรวจสอบและสร้างโฟลเดอร์เก็บรูปภาพ
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

// 2. API รับข้อมูลแจ้งเหตุ (พิกัด + รูปภาพ)
app.post('/api/reports', upload.array('images'), async (req, res) => {
  const { reporter_name, age, gender, phone, details, latitude, longitude } = req.body;
  const imageUrls = req.files ? req.files.map(f => f.filename).join(',') : '';

  try {
    const [result] = await db.execute(
      'INSERT INTO reports (reporter_name, age, gender, phone, details, latitude, longitude, status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [reporter_name, age, gender, phone, details, latitude, longitude, 'pending', imageUrls]
    );
    res.status(201).json({ message: 'บันทึกสำเร็จ', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API อื่นๆ (ดึงข้อมูล/ลบ/อัปเดต)
app.get('/api/admin/reports', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM reports ORDER BY created_at DESC');
  res.json(rows);
});

app.patch('/api/admin/reports/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await db.query('UPDATE reports SET status = ? WHERE id = ?', [status, id]);
  res.json({ message: 'OK' });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));