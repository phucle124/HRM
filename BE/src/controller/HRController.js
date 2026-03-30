const HRService = require('../services/HRService');

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
    const { name, email, department_id } = req.body;
    if (!name || !email || !department_id) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }
    try {
        const newEmployee = await HRService.createEmployee(name, email, department_id);
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

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}