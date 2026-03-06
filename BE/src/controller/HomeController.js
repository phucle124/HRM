const connection = require('../config/db');

const {getAllUsers} = require('../services/CRUDService')

const HomePage = async (req,res)=>{

    // res.render('home',{listUsers: await getAllUsers()});

    res.json({message: "List users", data: await getAllUsers()});
}

module.exports = {
    HomePage
}