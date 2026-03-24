const connection = require('../config/db');

//Tầng DAO

const AllUsersData = async ()=>{
    let [results,fields] = await connection.query('SELECT id, name, email, password, phone, role, is_lock FROM users');
    return results;
}

const UserByIdData = async (userId) =>{
    let [results, fields] = await connection.query(`
        SELECT id, name, email, password, phone , role
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

const UpdateUser = async (userId,name,email,password,phone,role)=>{
    const [results,fields] = await connection.query(`
        UPDATE users
        SET name=?,email=?,password=?,phone=?,role=?
        WHERE id = ?
    `,[name,email,password,phone,role,userId]);

    return results;
}

const DeleteUser = async (userId) =>{
    const[results,fields] = await connection.query(`
        DELETE FROM users    
        WHERE id = ?
    `,[userId]);

    return results;
}

const LockUser = async (userId, isLock) =>{
    const [results, fields] = await connection.query(`
        UPDATE users SET is_lock = ? WHERE id = ?
    `,[isLock,userId]);

    return results;
}

const AllDepartmentsData = async()=>{
    const [results,fields] = await connection.query(`
        SELECT department_id as id, name FROM departments
    `);
    return results;
}

const DepartmentByIdData = async(departmentId)=>{
    const [results, fields] = await connection.query(`
        SELECT department_id as id, name, manager_id FROM departments
        WHERE department_id = ?
    `,[departmentId]);

    return results;
}

module.exports = {
    AllUsersData,
    UserByIdData,
    CreateUser,
    UpdateUser,
    DeleteUser,
    LockUser,

    AllDepartmentsData,
    DepartmentByIdData
}