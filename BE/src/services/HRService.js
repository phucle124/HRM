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

// 1. Lấy danh sách và tính toán tổng hợp
const getAttendanceList = async (date, month, year) => {
    let sql = `
        SELECT a.*, e.full_name 
        FROM attendance a 
        JOIN employees e ON a.employee_id = e.employee_id 
        WHERE 1=1
    `;
    const params = [];

    if (date) {
        sql += " AND a.date = ?";
        params.push(date);
    } else if (month && year) {
        sql += " AND MONTH(a.date) = ? AND YEAR(a.date) = ?";
        params.push(month, year);
    }

    const [rows] = await connection.query(sql, params);

    // Logic Tổng hợp (Summary)
    const summary = {};
    rows.forEach(row => {
        const empId = row.employee_id;
        if (!summary[empId]) {
            summary[empId] = { name: row.full_name, totalDays: 0, lateCount: 0, totalHours: 0 };
        }

        summary[empId].totalDays += 1;

        // Giả định đi trễ sau 08:30:00
        if (row.check_in > '08:30:00') {
            summary[empId].lateCount += 1;
        }

        // Tính giờ làm (đơn giản hóa)
        if (row.check_in && row.check_out) {
            const hours = (new Date(`1970-01-01T${row.check_out}`) - new Date(`1970-01-01T${row.check_in}`)) / 3600000;
            summary[empId].totalHours += parseFloat(hours.toFixed(2));
        }
    });

    return { details: rows, summary: Object.values(summary) };
};

// 2. Cập nhật record
const updateAttendanceRecord = async (id, check_in, check_out) => {
    await connection.query(
        'UPDATE attendance SET check_in = ?, check_out = ? WHERE attendance_id = ?',
        [check_in, check_out, id]
    );
    return { attendance_id: id, check_in, check_out };
};

const getAllRewardsDiscipline = async () => {
    const [rows] = await connection.query(`
        SELECT rd.*, e.full_name 
        FROM rewards_discipline rd 
        JOIN employees e ON rd.employee_id = e.employee_id 
        ORDER BY rd.date_recorded DESC
    `);
    return rows;
};

// 2. Thêm mới bản ghi
const createRewardDiscipline = async (data) => {
    const { employee_id, type, title, description, date_recorded } = data;
    const [results] = await connection.query(
        'INSERT INTO rewards_discipline (employee_id, type, title, description, date_recorded) VALUES (?, ?, ?, ?, ?)',
        [employee_id, type, title, description, date_recorded]
    );
    return { record_id: results.insertId, ...data };
};

// 3. Cập nhật bản ghi
const updateRewardDiscipline = async (id, data) => {
    const { type, title, description, date_recorded } = data;
    await connection.query(
        'UPDATE rewards_discipline SET type = ?, title = ?, description = ?, date_recorded = ? WHERE record_id = ?',
        [type, title, description, date_recorded, id]
    );
    return { record_id: id, ...data };
};

// 4. Xóa bản ghi
const deleteRewardDiscipline = async (id) => {
    await connection.query('DELETE FROM rewards_discipline WHERE record_id = ?', [id]);
    return { message: "Xóa thành công", record_id: id };
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAttendanceList,
    updateAttendanceRecord,
    getAllRewardsDiscipline,
    createRewardDiscipline,
    updateRewardDiscipline,
    deleteRewardDiscipline

}