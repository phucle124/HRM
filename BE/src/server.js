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

//Config view engine
config_ViewEngine(app); //Cố định view engine để test với EJS


//MiddleWares
app.use(cors({
    origin: 'https://hrm-fe.42web.io', // Cổng của React
    credentials: true                // Cho phép gửi Session/Cookie
}));

app.set('trust proxy', 1); //Giúp express tin tưởng vào proxy này

//Các Routers
//app.use('/', webRoute);
app.use('/', apiRoute);



app.listen(port, () =>{
    console.log(`Server is now running on port ${port}`);
});
