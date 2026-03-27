require('dotenv').config();

const cors = require('cors');

const express = require('express');

//Dùng EJS để test hiển thị trên giao diện(Phía BE)
const webRoute = require('./routes/web');

const apiRoute = require('./routes/api');

const db = require('./config/db');

const config_ViewEngine = require('./config/viewEngine');


//config app BackEnd
const app = express();
const port = process.env.PORT;


//Config req.body
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Config view engine
config_ViewEngine(app); //Cố định view engine để test với EJS


//MiddleWares
app.use(cors()); //dùng cho React thì mới làm việc với BE(NodeJS) đc


//app.use('/', webRoute);
app.use('/', apiRoute);



app.listen(port, () =>{
    console.log(`Server is now running on port ${port}`);
});




