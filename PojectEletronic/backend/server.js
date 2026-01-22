const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// API สำหรับรับข้อมูลการแจ้งปัญหาจากหน้า Vue
app.post('/api/reports', async (req, res) => {
  const { reporter_name, age, gender, phone, details, latitude, longitude } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO reports (reporter_name, age, gender, phone, details, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [reporter_name, age, gender, phone, details, latitude, longitude]
    );
    res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ดึงข้อมูลข่าวสารการดับไฟ (สำหรับหน้า FollowNews)
app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM news ORDER BY start_time DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ดึงสถานะการแจ้งปัญหาทั้งหมด (สำหรับหน้า AreaStatus)
app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reports ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Backend server running on http://localhost:3000');
});