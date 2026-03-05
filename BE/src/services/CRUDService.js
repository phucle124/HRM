const connection = require('../config/db');

const getAllUsers = async ()=>{
    let [results,fields] = await connection.query('SELECT * FROM users');
    return results;
}

module.exports = {
    getAllUsers,
}