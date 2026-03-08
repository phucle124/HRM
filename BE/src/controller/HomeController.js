const connection = require('../config/db');

const {getAllUsers ,getUserById} = require('../services/CRUDService')

const AllUsersData = async (req,res)=>{

    res.json(await getAllUsers());
}

const UserByIdData = async (req,res) =>{
    let userId = req.body.id;
    res.json(await getUserById(userId));
}

const HomePage = async (req,res)=>{

    res.render('home',{listUsers: await getAllUsers()});

}

module.exports = {
    AllUsersData,
    UserByIdData,
    HomePage,
}