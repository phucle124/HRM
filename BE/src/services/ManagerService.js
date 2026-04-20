const db = require('../config/db');

const ManagerService = {
    // 1. Lấy danh sách nhân viên trong phòng mà Manager quản lý
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
            console.error("Lỗi tại getStaffList Service:", error);
            throw error;
        }
    },

    // 2. Duyệt hoặc từ chối đơn nghỉ phép (Cập nhật bảng leaves)
    // Sửa leave_Id thành leave_id để đồng bộ toàn hệ thống
    updateLeaveStatus: async (leave_id, status) => {
        try {
            // Câu lệnh SQL cập nhật trạng thái dựa trên ID đơn nghỉ
            const query = `UPDATE leaves SET status = ? WHERE leave_id = ?`;
            
            // Thực thi truy vấn với tham số để chống SQL Injection
            // Thứ tự truyền: [giá trị status mới, mã đơn leave_id]
            const [result] = await db.execute(query, [status, leave_id]);
            
            return result;
        } catch (error) {
            console.error("Lỗi tại updateLeaveStatus Service:", error);
            throw error;
        }
    }
};

module.exports = ManagerService;