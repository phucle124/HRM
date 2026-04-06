require('dotenv').config();
const cors = require('cors'); 
const express = require('express');


const webRoute = require('./routes/web');
const apiRoute = require('./routes/api');
const db = require('./config/db'); 
const config_ViewEngine = require('./config/viewEngine');
const sessionConfig = require('./config/session');
const app = express();
const port = process.env.PORT || 8888; // Thêm || 8888 để lỡ file .env lỗi nó vẫn chạy

// --- CẤU HÌNH MIDDLEWARE ---
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // Cổng của React
    credentials: true                // Cho phép gửi Session/Cookie
}));

// --- GIỮ NGUYÊN CẤU HÌNH CŨ ---
config_ViewEngine(app);
app.use(sessionConfig);
// --- CÁC ROUTERS ---
app.use('/api', apiRoute); 
app.use('/', webRoute); 


app.listen(port, () =>{
    console.log(`Server is now running on port ${port}`);
});