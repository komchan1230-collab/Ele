const mysql = require('mysql2');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // ปกติ XAMPP รหัสผ่านว่าง
  database: 'pak_kret_db', // ชื่อฐานข้อมูลที่คุณเพิ่งสร้าง
  port: 3306
});

module.exports = connection.promise();