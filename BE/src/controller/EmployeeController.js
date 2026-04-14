const db = require('../config/db');

// 1. Hàm lấy Profile
exports.getProfile = async (req, res) => {
    try {
        const employeeId = req.params.id || 4; 
        const [rows] = await db.execute(
            `SELECT e.*, d.name as department_name 
             FROM employees e 
             LEFT JOIN departments d ON e.department_id = d.department_id
             WHERE e.employee_id = ?`, 
            [employeeId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Không tìm thấy" });
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// 2. Hàm điểm danh 
exports.checkIn = async (req, res) => {
    try {
        // Ưu tiên lấy ID từ React gửi lên (req.body)
        const employee_id = req.body.employee_id;

        console.log("ID nhận được từ React nè:", employee_id);

        if (!employee_id) {
            return res.status(401).json({ 
                message: "Lỗi: Không tìm thấy ID nhân viên để điểm danh!" 
            });
        }

        return res.status(200).json({ 
            message: `Điểm danh thành công cho nhân viên số ${employee_id}!` 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Lỗi server rồi!" });
    }
};

// 3. Hàm lấy lương
exports.getSalary = async (req, res) => {
    try {
        const employeeId = req.params.id; 
        const [rows] = await db.execute(
            `SELECT s.*, e.full_name FROM salary s
             JOIN employees e ON s.employee_id = e.employee_id
             WHERE s.employee_id = ?`, 
            [employeeId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Chưa có lương" });
        return res.status(200).json(rows);
} catch (error) {
    console.log("LỖI LẤY LƯƠNG:", error); 
    return res.status(500).json({ message: "Lỗi server lấy lương" });
    }
};