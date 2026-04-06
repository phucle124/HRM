const connection = require('../config/db');

const encrypt = require('bcrypt');




const login = async (email,password) =>{

    const [results,fields] = await connection.query(`
            SELECT id, name, role, password, is_lock FROM users WHERE email = ?  
        `,[email]);

        let dataUser = results[0];

        if(!dataUser) throw new Error("Người dùng không tồn tại");

        if(dataUser.is_lock) {
            throw new Error("Tài khoản đã bị khóa");
        }

    const isMatch = encrypt.compare(password,dataUser.password);
    if(!isMatch) throw new Error("Sai mật khẩu");
    
    
    //Xóa mật khẩu tránh bị lộ thông tin đăng nhập
    delete dataUser.password;

    return dataUser;
}

module.exports ={
    login
}