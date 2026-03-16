const connection = require('../config/db');

const getAllUsers = async ()=>{
    let [results,fields] = await connection.query('SELECT id, name, email, password, phone,role FROM users');
    return results;
}

const getUserById = async (userId) =>{
    let [results, fields] = await connection.query(`
        SELECT id, name, email, password, phone 
        FROM users
        WHERE id = ?
    `,[userId]);
    return results;
}

const CreateUser = async (name,email,password,phone,role)=>{

    const [results,fields] = await connection.query(`
        INSERT INTO users(name,email,password,phone,role)
        VALUES (?,?,?,?,?)
    `,[name,email,password,phone,role]);

    return results;

}

const UpdateUser = async (id,name,email,password,phone,role)=>{
    const [results,fields] = await connection.query(`
        UPDATE users
        SET name=?,email=?,password=?,phone=?,role=?
        WHERE id = ?
    `,[name,email,password,phone,role,id]);

    return results;
}

const DeleteUser = async (userid) =>{
    const[results,fields] = await connection.query(`
        DELETE FROM users    
        WHERE id = ?
    `,[userid]);

    return results;
}


module.exports = {
    getAllUsers,
    getUserById,
    CreateUser,
    UpdateUser,
    DeleteUser,
}