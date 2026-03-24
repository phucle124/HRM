const connection = require('../config/db');
const encrypt = require('bcrypt');

// Lấy danh sách tất cả nhân viên kèm thông tin phòng ban và hỗ trợ tìm kiếm
const getAllEmployees = async (searchQuery = '') => {
    let query = `
        SELECT 
            e.employee_id as id, 
            e.full_name as name, 
            e.email, 
            d.name as department_name 
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.department_id
    `;
    const params = [];

    if (searchQuery) {
        // Tìm kiếm theo tên, tên phòng ban, hoặc mã nhân viên (employee_id)
        query += ` WHERE (e.full_name LIKE ? OR d.name LIKE ? OR e.employee_id = ?)`;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, searchQuery);
    }

    const [results] = await connection.query(query, params);
    return results;
}

// Lấy thông tin một nhân viên bằng ID (employee_id)
const getEmployeeById = async (id) => {
    // Alias các cột để phù hợp với view (edit-employee.ejs)
    const [results] = await connection.query('SELECT employee_id as id, full_name as name, email, department_id FROM employees WHERE employee_id = ?', [id]);
    return results[0];
}

// Tạo nhân viên mới
const createEmployee = async (name, email, department_id) => {
    const [results] = await connection.query(
        'INSERT INTO employees (full_name, email, department_id) VALUES (?, ?, ?)',
        [name, email, department_id]
    );
    return { id: results.insertId, name, email, department_id };
}

// Cập nhật thông tin nhân viên (không bao gồm mật khẩu)
const updateEmployee = async (id, name, email, department_id) => {
    const [results] = await connection.query(
        'UPDATE employees SET full_name = ?, email = ?, department_id = ? WHERE employee_id = ?',
        [name, email, department_id, id]
    );
    return results;
}

// Xóa nhân viên
const deleteEmployee = async (id) => {
    const [results] = await connection.query('DELETE FROM employees WHERE employee_id = ?', [id]);
    return results;
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}