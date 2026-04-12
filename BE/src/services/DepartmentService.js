const connection = require('../config/db');
const redisClient = require('../config/redis'); // Thêm kết nối Redis

// 1. Lấy danh sách tất cả phòng ban kèm tên trưởng phòng (ƯU TIÊN CAO)
const getAllDepartments = async () => {
    const cacheKey = 'depts:all_full';
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [results] = await connection.query(`
        SELECT 
            d.department_id, 
            d.name, 
            e.full_name as manager_name 
        FROM departments d
        LEFT JOIN employees e ON d.manager_id = e.employee_id
    `);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
    return results;
};

// 2. Lấy danh sách nhân viên theo phòng ban (ƯU TIÊN CAO)
const getEmployeesByDepartmentId = async (departmentId) => {
    const cacheKey = `depts:employees:${departmentId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [results] = await connection.query(
        'SELECT employee_id, full_name, email, position FROM employees WHERE department_id = ?',
        [departmentId]
    );

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
    return results;
};

// 3. Tạo phòng ban mới (Xóa cache list)
const createDepartment = async (name, manager_id) => {
    const [results] = await connection.query(
        'INSERT INTO departments (name, manager_id) VALUES (?, ?)',
        [name, manager_id || null]
    );
    
    // Khi thêm mới, danh sách tổng đã thay đổi -> Xóa cache
    await redisClient.del('depts:all_full');
    return results;
};

// 4. Cập nhật phòng ban (Xóa cache list)
const updateDepartment = async (id, name, manager_id) => {
    const [results] = await connection.query(
        'UPDATE departments SET name = ?, manager_id = ? WHERE department_id = ?',
        [name, manager_id || null, id]
    );
    
    await redisClient.del('depts:all_full');
    return results;
};

// 5. Xóa phòng ban (Xóa cache list)
const deleteDepartment = async (id) => {
    const [countResult] = await connection.query(
        'SELECT COUNT(*) as employee_count FROM employees WHERE department_id = ?',
        [id]
    );
    const employeeCount = countResult[0].employee_count;

    if (employeeCount > 0) {
        throw new Error(`Không thể xóa phòng ban vì vẫn còn ${employeeCount} nhân viên.`);
    }

    const [deleteResult] = await connection.query('DELETE FROM departments WHERE department_id = ?', [id]);
    
    // Xóa thành công thì dọn dẹp cache
    await redisClient.del('depts:all_full');
    return deleteResult;
};


const getDepartmentById = async (id) => {
    const [results] = await connection.query('SELECT * FROM departments WHERE department_id = ?', [id]);
    return results[0];
};

const getAllEmployeesForDropdown = async () => {
    const [results] = await connection.query('SELECT employee_id, full_name FROM employees');
    return results;
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    getAllEmployeesForDropdown,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getEmployeesByDepartmentId,
};