const HRService = require('../services/HRService');
const db = require('../config/db'); // Import DB connection
const { sendAccountEmail } = require('../services/mailService'); // Import mail service

// [GET] /api/employees - Lấy danh sách nhân viên (có tìm kiếm)
const getAllEmployees = async (req, res) => {
    const searchQuery = req.query.search || '';
    try {
        const employees = await HRService.getAllEmployees(searchQuery);
        return res.status(200).json({ message: 'Success', data: employees });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server: " + err.message });
    }
}

// [GET] /api/employees/:id - Lấy thông tin một nhân viên
const getEmployeeById = async (req, res) => {
    const employeeId = req.params.id;
    try {
        const employee = await HRService.getEmployeeById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên.' });
        }
        return res.status(200).json({ message: 'Success', data: employee });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server: " + err.message });
    }
}

// [POST] /api/employees - Tạo nhân viên mới
const createEmployee = async (req, res) => {
    console.log("Dữ liệu Render nhận được:", req.body);
    const { full_name, email, dob, gender, hire_date, position, department_id } = req.body;
    if (!full_name || !email || !dob || !gender || !hire_date|| !position || !department_id) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }
    try {
        const newEmployee = await HRService.createEmployee(full_name, email, dob, gender, hire_date, position, department_id);
        return res.status(201).json({ message: 'Tạo nhân viên thành công', data: newEmployee });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server: " + err.message });
    }
}

// [PUT] /api/employees/:id - Cập nhật thông tin nhân viên
const updateEmployee = async (req, res) => {
    const employeeId = req.params.id;
    const { name, email, department_id } = req.body;
     if (!name || !email || !department_id) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }
    try {
        const employee = await HRService.getEmployeeById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên.' });
        }
        const result = await HRService.updateEmployee(employeeId, name, email, department_id);
        return res.status(200).json({ message: 'Cập nhật nhân viên thành công', data: result });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server: " + err.message });
    }
}

// [DELETE] /api/employees/:id - Xóa nhân viên
const deleteEmployee = async (req, res) => {
    const employeeId = req.params.id;
    try {
        const employee = await HRService.getEmployeeById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên.' });
        }
        await HRService.deleteEmployee(employeeId);
        return res.status(200).json({ message: 'Xóa nhân viên thành công' });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server: " + err.message });
    }
}

const assignUserAccount = async (req, res) => {
    const employeeId = req.params.id;
    const { userId, userEmail, userPassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !userEmail || !userPassword) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đủ userId, email và password.' });
    }

    try {
        // Bước 1: Cập nhật user_id cho nhân viên trong database
        // Lưu ý: Để nhất quán với cấu trúc dự án, logic này nên được đặt trong HRService.
        // Tuy nhiên, để hoàn thành yêu cầu, tôi tạm thời truy vấn DB trực tiếp tại đây.
        const [updateResult] = await db.execute(
            'UPDATE employees SET user_id = ? WHERE employee_id = ?',
            [userId, employeeId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy nhân viên với ID: ${employeeId}` });
        }

        // Bước 2: Lấy thông tin email và tên đầy đủ của nhân viên để gửi mail
        const [employeeInfo] = await db.execute(
            `SELECT e.full_name, e.email 
             FROM employees e
             JOIN users u ON e.user_id = u.id
             WHERE e.employee_id = ?`,
            [employeeId]
        );

        if (employeeInfo.length === 0) {
            // Trường hợp này hiếm khi xảy ra nếu update thành công, nhưng vẫn nên kiểm tra
            return res.status(404).json({ message: 'Không thể lấy thông tin nhân viên sau khi cập nhật.' });
        }

        const { full_name, email } = employeeInfo[0];

        // Bước 3: Gọi service để gửi email
        try {
            await sendAccountEmail(email, full_name, { userEmail, userPassword });
        } catch (mailError) {
            // Nếu gửi mail lỗi, vẫn coi như thành công ở phía gán user
            // nhưng trả về mã 207 để client biết có một phần không hoàn thành.
            console.error('Lỗi gửi mail nhưng đã gán user thành công:', mailError.message);
            return res.status(207).json({ 
                message: `Gán tài khoản cho nhân viên ID ${employeeId} thành công, nhưng gửi email thông báo thất bại.`,
                error: mailError.message 
            });
        }

        return res.status(200).json({ message: `Gán tài khoản và gửi email thông báo cho nhân viên '${full_name}' thành công.` });

    } catch (dbError) {
        console.error("Lỗi khi gán tài khoản:", dbError);
        return res.status(500).json({ message: "Lỗi server khi gán tài khoản: " + dbError.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    assignUserAccount
}