const connection = require('../config/db');

const encrypt = require('bcrypt');




const login = async (input_email, input_password) => {

    const [results] = await connection.query(`
        SELECT id, role, password, is_lock
        FROM users 
        WHERE email = ?
    `, [input_email]);

    let dataUser = results[0];
        
    if (!dataUser) throw new Error("Người dùng không tồn tại");

    if (dataUser.is_lock) throw new Error("Tài khoản đã bị khóa");

    const isMatch = encrypt.compare(input_password, dataUser.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    delete dataUser.password;

    return dataUser;
};

module.exports ={
    login
}