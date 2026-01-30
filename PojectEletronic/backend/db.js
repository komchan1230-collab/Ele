const mysql = require('mysql2');

const connection = mysql.createConnection({
    // 👇 1. ดูที่แท็บ "Parameters" ด้านล่างในรูป ก๊อปปี้ Host มาใส่ (ยาวๆ)
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com', 
    
    // 👇 2. Port ของ TiDB คือ 4000 เสมอ
    port: 4000,
    
    // 👇 3. ดูที่แท็บ "Parameters" หาคำว่า User (มักจะขึ้นต้นด้วยตัวเลข.root)
    user: '2Dwofiqs2ZNkSDA.root', 
    
    // 👇 4. รหัสผ่านจากในรูป (ผมใส่ให้แล้ว)
    password: '73AsTtiYqtuokFJ1', 
    
    // 👇 5. Database ชื่อ test (ตามในรูป)
    database: 'test',
    
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

connection.connect((err) => {
    if (err) {
        console.error('❌ เชื่อมต่อ Database ไม่สำเร็จ:', err);
        return;
    }
    console.log('✅ เชื่อมต่อ TiDB Cloud สำเร็จแล้ว!');
});

module.exports = connection.promise();