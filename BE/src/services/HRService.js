const connection = require('../config/db');
const redisClient = require('../config/redis'); // Thêm redis
const encrypt = require('bcrypt');

// 1. Lấy danh sách tất cả nhân viên (ƯU TIÊN CAO)
const getAllEmployees = async (searchQuery = '') => {
    const cacheKey = 'employees:all_full';
    
    // Chỉ lấy từ Cache nếu KHÔNG có từ khóa tìm kiếm
    if (!searchQuery) {
        const cached = await redisClient.get(cacheKey);
        if (cached) return JSON.parse(cached);
    }

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
        query += ` WHERE (e.full_name LIKE ? OR d.name LIKE ? OR e.employee_id = ?)`;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, searchQuery);
    }

    const [results] = await connection.query(query, params);

    // Chỉ lưu vào Cache nếu là danh sách đầy đủ (không search)
    if (!searchQuery) {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
    }
    
    return results;
}

// 2. Tạo nhân viên mới (Xóa cache)
const createEmployee = async (full_name, email, dob, gender, hire_date, position, department_id) => {
    const [day, month, year] = dob.split('/');
    const formattedDob = `${year}-${month}-${day}`;
    const [hDay, hMonth, hYear] = hire_date.split('/');
    const formattedHireDate = `${hYear}-${hMonth}-${hDay}`;
    const [results] = await connection.query(
        'INSERT INTO employees (full_name, email, dob, gender, hire_date, position, department_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [full_name, email, formattedDob, gender , formattedHireDate, position,department_id]
    );
    
    // Dữ liệu thay đổi -> Xóa sạch các cache liên quan đến nhân viên
    await redisClient.del('employees:all_full');
    await redisClient.del('employees:all'); // Xóa luôn bên CRUDService cho đồng bộ
    
    return { id: results.insertId, full_name, email, dob: formattedDob, gender, hire_date: formattedHireDate, position, department_id };
}

// 3. Cập nhật thông tin nhân viên (Xóa cache)
const updateEmployee = async (id, name, email, department_id) => {
    const [results] = await connection.query(
        'UPDATE employees SET full_name = ?, email = ?, department_id = ? WHERE employee_id = ?',
        [name, email, department_id, id]
    );
    
    await redisClient.del('employees:all_full');
    await redisClient.del('employees:all');
    
    // Nếu ông muốn kỹ hơn, xóa luôn cache theo phòng ban vì nhân viên này có thể đổi phòng
    // await redisClient.del(`employees:dept:${department_id}`); 

    return results;
}

// 4. Xóa nhân viên (Xóa cache)
const deleteEmployee = async (id) => {
    const [results] = await connection.query('DELETE FROM employees WHERE employee_id = ?', [id]);
    
    await redisClient.del('employees:all_full');
    await redisClient.del('employees:all');
    
    return results;
}

// Các hàm khác giữ nguyên
const getEmployeeById = async (id) => {
    const [results] = await connection.query('SELECT employee_id as id, full_name as name, email, department_id FROM employees WHERE employee_id = ?', [id]);
    return results[0];
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}