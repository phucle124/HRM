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

const CreateUser = async (req,res)=>{

    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;

    if(email=='' || password==''||phone==''){
        res.send('Vui lòng nhập đầy đủ thông tin');
    }

    const [results,fields] = await connection.query(`
        INSERT INTO users
        VALUES email=?, password =?, phone =?
    `,[email,password,phone]);

    if(results.length > 0){
        res.send('Thêm tài khoản thành công');
        console.log('Tài khoản được thêm: ' ,results);
    }

}



module.exports = {
    getAllUsers,
    getUserById,
    CreateUser,
}