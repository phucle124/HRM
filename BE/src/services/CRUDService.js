const redis = require('redis')
const connection = require('../config/db');
const redisClient = require('../config/redis'); 
//Tầng DAO

const AllUsersData = async () => {
    const cacheKey = 'users:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [results] = await connection.query('SELECT id, name, email, password, phone, role, is_lock FROM users');
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(results)); // Lưu 1 tiếng
    return results;
}

const AllDepartmentsData = async () => {
    const cacheKey = 'depts:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [results] = await connection.query('SELECT department_id, name, manager_id FROM departments');
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
    return results;
}

const AllEmployeesData = async () => {
    const cacheKey = 'employees:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [results] = await connection.query('SELECT * FROM employees');
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
    return results;
}

const AllManagersData = async () => {
    const cacheKey = 'managers:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [results] = await connection.query(`
        SELECT * FROM employees e
        JOIN departments d 
        ON e.employee_id = d.manager_id
    `);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
    return results;
}

const AllAttendancesData = async()=>{
    const cacheKey = 'attendances:all';
    const cached = await redisClient.get(cacheKey);
    if(cached) return JSON.parse(cached);

    const [results] = await connection.query(`
        SELECT * FROM attendance
    `);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
}

const Employees_ByDepartmentId = async (departmentId) => {
    const cacheKey = `employees:dept:${departmentId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [results] = await connection.query('SELECT * FROM employees WHERE department_id = ?', [departmentId]);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
    return results;
}


const CreateUser = async (name, email, password, phone, role) => {
    const [results] = await connection.query('INSERT INTO users(name,email,password,phone,role) VALUES (?,?,?,?,?)', [name, email, password, phone, role]);
    await redisClient.del('users:all'); // Xóa cache để lần sau load lại có người mới
    return results;
}

const UpdateUser = async (userId, name, email, password, phone, role) => {
    const [results] = await connection.query('UPDATE users SET name=?,email=?,password=?,phone=?,role=? WHERE id = ?', [name, email, password, phone, role, userId]);
    await redisClient.del('users:all');
    return results;
}

const DeleteUser = async (userId) => {
    const [results] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);
    await redisClient.del('users:all');
    return results;
}

const LockUser = async (userId, isLock) => {
    const [results] = await connection.query('UPDATE users SET is_lock = ? WHERE id = ?', [isLock, userId]);
    await redisClient.del('users:all');
    return results;
}

const CreateDepartment = async (department_Name) => {
    const [results] = await connection.query('INSERT INTO departments(name, manager_id) VALUES(?,NULL)', [department_Name]);
    await redisClient.del('depts:all');
    return results;
}

const EditDepartment = async (departmentId, departmentName, ManagerId) => {
    const [results] = await connection.query(`
        UPDATE departments SET name = ?, manager_id = ? WHERE department_id = ?
        AND (NOT (name <=> ?) OR NOT (manager_id <=> ?))
    `, [departmentName, ManagerId, departmentId, departmentName, ManagerId]);
    await redisClient.del('depts:all');
    await redisClient.del('managers:all'); // Vì manager thay đổi nên phải xóa cả cache manager
    return results;
}

const DeleteDepartment = async (departmentId) => {
    const [results] = await connection.query(`
        DELETE FROM departments d WHERE d.department_id = ?
        AND NOT EXISTS (SELECT e.employee_id FROM employees e WHERE e.department_id = d.department_id)
    `, [departmentId]);
    await redisClient.del('depts:all');
    return results;
}


const UserByIdData = async (userId) => {
    const [results] = await connection.query('SELECT id, name, email, password, phone , role FROM users WHERE id = ?', [userId]);
    return results;
}

const DepartmentByIdData = async (departmentId) => {
    const [results] = await connection.query('SELECT department_id, name, manager_id FROM departments WHERE department_id = ?', [departmentId]);
    return results;
}

const EmployeeByIdData = async (employeeId) => {
    const [results] = await connection.query('SELECT * FROM employees WHERE employee_id = ?', [employeeId]);
    return results;
}

const Assign_Manager = async (departmentId, employeeId) => {
    const [results] = await connection.query('UPDATE departments SET manager_id = ? WHERE department_id = ?', [employeeId, departmentId]);
    await redisClient.del('depts:all');
    await redisClient.del('managers:all');
    return results;
}

const Manager_ByDepartmentId = async (departmentId) => {
    const [results] = await connection.query(`
        SELECT e.employee_id, e.full_name
        FROM employees e
        JOIN departments d ON e.employee_id = d.manager_id
        WHERE d.department_id = ? 
    `, [departmentId]);
    return results;
}

module.exports = {
    AllUsersData, UserByIdData, CreateUser, UpdateUser, DeleteUser, LockUser,
    AllDepartmentsData, DepartmentByIdData, CreateDepartment, DeleteDepartment, EditDepartment,
    AllAttendancesData,
    AllEmployeesData, EmployeeByIdData, Assign_Manager, AllManagersData,
    Manager_ByDepartmentId, Employees_ByDepartmentId,
    
}