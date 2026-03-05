require('dotenv').config();

const express = require('express');

const webRoute = require('./routes/web');

const db = require('./config/db');

const {getAllUsers} = require('./services/CRUDService')

//config app
const app = express();

const port = process.env.PORT;
const host = process.env.HOST_NAME;


const testDb = async ()=>{
    const KQ = await getAllUsers();
    console.log(KQ);
}

testDb();

app.listen(port,host, () =>{
    console.log(`Server is now running on port ${port}`);
});




