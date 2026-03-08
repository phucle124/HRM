const connection = require('../config/db');

const getAllUsers = async ()=>{
    let [results,fields] = await connection.query('SELECT id, name FROM users');
    return results;
}

const getUserById = async (userId) =>{
    let [results, fields] = await connection.query(`
        SELECT id, name 
        FROM users
        WHERE id = ?
    `,[userId]);
    return results;
}

module.exports = {
    getAllUsers,
    getUserById,
}