const DepartmentService = require('../services/DepartmentService');

// [GET] /api/departments - Lấy danh sách phòng ban
const getAllDepartments = async (req, res) => {
    try {
        const departments = await DepartmentService.getAllDepartments();
        return res.status(200).json({ status: 'success', data: departments });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// [GET] /api/departments/:id - Lấy thông tin một phòng ban
const getDepartmentById = async (req, res) => {
    const departmentId = req.params.id;
    try {
        const department = await DepartmentService.getDepartmentById(departmentId);
        if (!department) {
            return res.status(404).json({ status: 'error', message: 'Không tìm thấy phòng ban.' });
        }
        return res.status(200).json({ status: 'success', data: department });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// [POST] /api/departments - Tạo phòng ban mới
const createDepartment = async (req, res) => {
    const { name, manager_id } = req.body;
    if (!name) {
        return res.status(400).json({ status: 'error', message: 'Tên phòng ban là bắt buộc.' });
    }
    try {
        const result = await DepartmentService.createDepartment(name, manager_id);
        const newDepartment = { id: result.insertId, name, manager_id };
        return res.status(201).json({ status: 'success', data: newDepartment });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// [PUT] /api/departments/:id - Cập nhật phòng ban
const updateDepartment = async (req, res) => {
    const departmentId = req.params.id;
    const { name, manager_id } = req.body;
    if (!name) {
        return res.status(400).json({ status: 'error', message: 'Tên phòng ban là bắt buộc.' });
    }
    try {
        await DepartmentService.updateDepartment(departmentId, name, manager_id);
        return res.status(200).json({ status: 'success', message: 'Cập nhật phòng ban thành công.' });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// [DELETE] /api/departments/:id - Xóa phòng ban
const deleteDepartment = async (req, res) => {
    const departmentId = req.params.id;
    try {
        await DepartmentService.deleteDepartment(departmentId);
        return res.status(200).json({ status: 'success', message: 'Xóa phòng ban thành công.' });
    } catch (err) {
        // Lỗi nghiệp vụ từ Service (còn nhân viên)
        if (err.message.includes('Không thể xóa')) {
            return res.status(400).json({ status: 'error', message: err.message });
        }
        // Lỗi server khác
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// [GET] /api/departments/:id/employees - Lấy danh sách nhân viên của một phòng ban
const getEmployeesInDepartment = async (req, res) => {
    const departmentId = req.params.id;
    try {
        const employees = await DepartmentService.getEmployeesByDepartmentId(departmentId);
        return res.status(200).json({ status: 'success', data: employees });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getEmployeesInDepartment,
};