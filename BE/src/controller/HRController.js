const HRService = require('../services/HRService');
const { AllDepartmentsData } = require('../services/CRUDService'); // Dùng lại service có sẵn để lấy phòng ban

// Hiển thị trang dashboard của HR với danh sách nhân viên (có tìm kiếm)
const getHRDashboard = async (req, res) => {
    const searchQuery = req.query.search || '';
    try {
        const employees = await HRService.getAllEmployees(searchQuery);
        res.render('hr/index', { employees, searchQuery });
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
}

// Hiển thị form thêm nhân viên mới
const showAddEmployeeForm = async (req, res) => {
    try {
        const departments = await AllDepartmentsData();
        res.render('hr/add-employee', { departments });
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
}

// Xử lý việc thêm nhân viên mới
const addNewEmployee = async (req, res) => {
    const { name, email, department_id } = req.body;
    if (!name || !email || !department_id) {
        return res.send('Vui lòng nhập đầy đủ thông tin.');
    }
    try {
        await HRService.createEmployee(name, email, department_id);
        res.redirect('/hr');
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
}

// Hiển thị form sửa thông tin nhân viên
const showEditEmployeeForm = async (req, res) => {
    const employeeId = req.params.id;
    try {
        const employee = await HRService.getEmployeeById(employeeId);
        const departments = await AllDepartmentsData();
        if (!employee) {
            return res.status(404).send('Không tìm thấy nhân viên.');
        }
        res.render('hr/edit-employee', { employee, departments });
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
}

// Xử lý việc cập nhật thông tin nhân viên
const updateEmployee = async (req, res) => {
    const { id, name, email, department_id } = req.body;
     if (!id || !name || !email || !department_id) {
        return res.send('Vui lòng nhập đầy đủ thông tin.');
    }
    try {
        await HRService.updateEmployee(id, name, email, department_id);
        res.redirect('/hr');
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
}

// Xử lý việc xóa nhân viên
const deleteEmployee = async (req, res) => {
    const employeeId = req.params.id;
    try {
        await HRService.deleteEmployee(employeeId);
        res.redirect('/hr');
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
}

module.exports = {
    getHRDashboard,
    showAddEmployeeForm,
    addNewEmployee,
    showEditEmployeeForm,
    updateEmployee,
    deleteEmployee
}