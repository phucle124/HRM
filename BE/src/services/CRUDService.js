const connection = require('../config/db');

//Tầng DAO

const AllUsersData = async ()=>{
    const [results,fields] = await connection.query('SELECT id, name, role, email, password, phone, is_lock FROM users');
    return results;
}

const UserByIdData = async (userId) =>{
    const [results, fields] = await connection.query(`
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
        SELECT department_id , name, manager_id FROM departments
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

const CreateDepartment = async(departmentName,ManagerId)=>{

    const [results,fields] = await connection.query(`
        INSERT INTO departments(name,manager_id)
        VALUES(?,?)
    `,[departmentName,ManagerId]);

    return results;
}

const DeleteDepartment = async(departmentId)=>{
    const [results,fields] = await connection.query(`
        DELETE FROM departments d
        WHERE d.department_id = 1
            AND NOT EXISTS (
                SELECT e.employee_id
                FROM employees e
                WHERE e.department_id = d.department_id
            );    
    `,[departmentId]);

    /*Note: Chỉ được xóa Phòng ban <=> 0 còn employee nào làm ở phòng đó */

    return results;
}

const EditDepartment = async(departmentName,ManagerId)=>{

    const [results,fields] = await connection.query(`
        UPDATE departments
        SET name = ?, manager_id = ?
        WHERE manager_id = ?
    `,[departmentName, ManagerId]);

    return results;
}

const AllEmployeesData = async()=>{
    const [results,fields] = await connection.query(`
        SELECT * FROM employees    
    `);

    return results;
}

const EmployeeByIdData = async(employeeId)=>{
    const [results,fields] = await connection.query(`
        SELECT * FROM employees
        WHERE employee_id = ?    
    `,[employeeId]);

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
    DepartmentByIdData,
    CreateDepartment, 
    DeleteDepartment, 
    EditDepartment,

    AllEmployeesData,
    EmployeeByIdData
}