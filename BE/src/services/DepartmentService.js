const connection = require('../config/db');

// Lấy danh sách tất cả phòng ban kèm tên trưởng phòng
const getAllDepartments = async () => {
    const [results] = await connection.query(`
        SELECT 
            d.department_id, 
            d.name, 
            e.full_name as manager_name 
        FROM departments d
        LEFT JOIN employees e ON d.manager_id = e.employee_id
    `);
    return results;
};

// Lấy thông tin một phòng ban bằng ID
const getDepartmentById = async (id) => {
    const [results] = await connection.query('SELECT * FROM departments WHERE department_id = ?', [id]);
    return results[0];
};

// Lấy tất cả nhân viên để hiển thị trong dropdown
const getAllEmployeesForDropdown = async () => {
    const [results] = await connection.query('SELECT employee_id, full_name FROM employees');
    return results;
};

// Tạo phòng ban mới
const createDepartment = async (name, manager_id) => {
    // manager_id có thể là null nếu không chọn
    const [results] = await connection.query(
        'INSERT INTO departments (name, manager_id) VALUES (?, ?)',
        [name, manager_id || null]
    );
    return results;
};

// Cập nhật phòng ban
const updateDepartment = async (id, name, manager_id) => {
    const [results] = await connection.query(
        'UPDATE departments SET name = ?, manager_id = ? WHERE department_id = ?',
        [name, manager_id || null, id]
    );
    return results;
};

// Xóa phòng ban (có kiểm tra nghiệp vụ)
const deleteDepartment = async (id) => {
    // 1. Kiểm tra xem còn nhân viên nào trong phòng ban không
    const [countResult] = await connection.query(
        'SELECT COUNT(*) as employee_count FROM employees WHERE department_id = ?',
        [id]
    );
    const employeeCount = countResult[0].employee_count;

    if (employeeCount > 0) {
        // Nếu còn, ném ra lỗi để Controller bắt và xử lý
        throw new Error(`Không thể xóa phòng ban vì vẫn còn ${employeeCount} nhân viên.`);
    }

    // 2. Nếu không còn nhân viên, tiến hành xóa
    const [deleteResult] = await connection.query('DELETE FROM departments WHERE department_id = ?', [id]);
    return deleteResult;
};

// Lấy danh sách nhân viên theo phòng ban
const getEmployeesByDepartmentId = async (departmentId) => {
    const [results] = await connection.query(
        'SELECT employee_id, full_name, email, position FROM employees WHERE department_id = ?',
        [departmentId]
    );
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