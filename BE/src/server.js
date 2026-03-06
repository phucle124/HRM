require('dotenv').config();

const express = require('express');

//Dùng EJS để test hiển thị trên giao diện(Phía BE)
const webRoute = require('./routes/web');

const apiRoute = require('./routes/api');

const db = require('./config/db');



//config app
const app = express();

const port = process.env.PORT;
const host = process.env.HOST_NAME;


//use app
app.use(express.json());
//app.use('/', webRoute);
app.use('/', apiRoute);

app.listen(port, () =>{
    console.log(`Server is now running on port ${port}`);
});




