const DepartmentService = require('../services/DepartmentService');

// Hiển thị trang danh sách phòng ban
const showDepartmentList = async (req, res) => {
    try {
        const departments = await DepartmentService.getAllDepartments();
        // Lấy thông báo lỗi từ query param nếu có (sau khi redirect từ hàm xóa)
        const errorMessage = req.query.error;
        res.render('hr/department', { departments, errorMessage });
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
};

// Hiển thị form thêm phòng ban
const showAddDepartmentForm = async (req, res) => {
    try {
        const employees = await DepartmentService.getAllEmployeesForDropdown();
        res.render('hr/department-add', { employees });
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
};

// Xử lý thêm phòng ban mới
const addDepartment = async (req, res) => {
    const { name, manager_id } = req.body;
    if (!name) {
        return res.send('Tên phòng ban là bắt buộc.');
    }
    try {
        await DepartmentService.createDepartment(name, manager_id);
        res.redirect('/hr/departments');
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
};

// Hiển thị form sửa phòng ban
const showEditDepartmentForm = async (req, res) => {
    const departmentId = req.params.id;
    try {
        const department = await DepartmentService.getDepartmentById(departmentId);
        const employees = await DepartmentService.getAllEmployeesForDropdown();
        if (!department) {
            return res.status(404).send('Không tìm thấy phòng ban.');
        }
        res.render('hr/department-edit', { department, employees });
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
};

// Xử lý cập nhật phòng ban
const updateDepartment = async (req, res) => {
    const { department_id, name, manager_id } = req.body;
    if (!department_id || !name) {
        return res.send('Dữ liệu không hợp lệ.');
    }
    try {
        await DepartmentService.updateDepartment(department_id, name, manager_id);
        res.redirect('/hr/departments');
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
};

// Xử lý xóa phòng ban
const deleteDepartment = async (req, res) => {
    const departmentId = req.params.id;
    try {
        await DepartmentService.deleteDepartment(departmentId);
        res.redirect('/hr/departments');
    } catch (err) {
        // Bắt lỗi từ Service và chuyển hướng về trang danh sách với thông báo lỗi
        const encodedError = encodeURIComponent(err.message);
        res.redirect(`/hr/departments?error=${encodedError}`);
    }
};

// Hiển thị danh sách nhân viên của một phòng ban
const showEmployeesInDepartment = async (req, res) => {
    const departmentId = req.params.id;
    try {
        const department = await DepartmentService.getDepartmentById(departmentId);
        const employees = await DepartmentService.getEmployeesByDepartmentId(departmentId);
        if (!department) {
            return res.status(404).send('Không tìm thấy phòng ban.');
        }
        res.render('hr/department-employees', { employees, department });
    } catch (err) {
        res.status(500).send("Lỗi server: " + err.message);
    }
};

module.exports = {
    showDepartmentList,
    showAddDepartmentForm,
    addDepartment,
    showEditDepartmentForm,
    updateDepartment,
    deleteDepartment,
    showEmployeesInDepartment,
};