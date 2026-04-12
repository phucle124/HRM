const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, 
    enableKeepAlive: true,
});
// const connection = mysql.createPool({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',      // Điền trực tiếp chữ root
//     password: '',      // Để trống nếu dùng XAMPP mặc định
//     database: 'hrm',   // Đảm bảo tên database trong phpMyAdmin của bạn là hrm
//     waitForConnections: true,
//     connectionLimit: 10,
//     maxIdle: 10,
//     enableKeepAlive: true,
//     // Tuyệt đối không để SSL ở đây khi chạy localhost
// });
module.exports = connection;
