const db = require('../config/db');

const ManagerService = {
    // Lấy danh sách nhân viên trong phòng mà Manager quản lý
    getStaffList: async (managerId) => {
        try {
            const query = `
                SELECT e.*, d.name as department_name 
                FROM employees e
                JOIN departments d ON e.department_id = d.department_id
                WHERE d.manager_id = ?`;
            const [rows] = await db.execute(query, [managerId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Duyệt hoặc từ chối đơn nghỉ phép (Cập nhật bảng leaves)
    updateLeaveStatus: async (leave_Id, status) => {
        try {
            const query = `UPDATE leaves SET status = ? WHERE leave_id = ?`;
            const [result] = await db.execute(query, [status, leave_Id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = ManagerService;