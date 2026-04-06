const express = require('express');
const router = express.Router();
const EmployeeController = require('../controller/EmployeeController');




// 1. Khai báo các Controller
const DepartmentController = require('../controller/DepartmentController');
const HRController = require('../controller/HRController');
const ManagerController = require('../controller/ManagerController'); // Đã gộp lại một chỗ
const { 
    getAllUsers, getUserById, deleteUser, editUser, createUser, 
    LoginHandle, lockUser, getAllDepartments, getDepartmentById, 
    createDepartment, editDepartment, deleteDepartment, getEmployeesByDepartment 
} = require('../controller/HomeController');
const { validateEmail, validatePassword, validatePhone } = require('../middlewares/validate');
const checkRole = require('../middlewares/Authorize');


//Áp dụng middleware phân quyền cho API login,home,logout
// router.use((req, res, next) => {
//     if (req.path === '/login' || req.path === '/' || req.path === '/logout') return next();
//     checkRole(req, res, next);
// });

// --- DANH SÁCH API ---

// Auth API
router.post('/login', LoginHandle);

// User Management (Admin)
router.get('/users', getAllUsers); 
router.get('/users/:id', getUserById); 
router.post('/users', validateEmail, validatePassword, validatePhone,createUser); 
router.put('/users/:id',validateEmail, validatePassword, validatePhone, editUser);
router.delete('/users/:id', deleteUser); 
router.patch('/users/:id/lock', lockUser); 

// Department Management
router.get('/departments', getAllDepartments); 
router.get('/departments/:id', getDepartmentById);
router.post('/departments', createDepartment);
router.put('/departments/:id', editDepartment);
router.delete('/departments/:id', deleteDepartment);
router.get('/departments/:id/employees', getEmployeesByDepartment);

// Employee Management (HR)
router.get('/employees', HRController.getAllEmployees);
router.post('/employees', HRController.createEmployee);
router.get('/employees/:id', HRController.getEmployeeById);
router.put('/employees/:id', HRController.updateEmployee);
router.delete('/employees/:id', HRController.deleteEmployee);

// --- ROLE MANAGER ---
// Link test: http://localhost:8888/manager/staff-list
router.get('/manager/staff-list', ManagerController.getStaffPage);
// Link duyệt nghỉ phép: http://localhost:8888/manager/approve-leave
router.post('/manager/approve-leave', ManagerController.approveLeave);


//Employee
// Link lấy Profile: http://localhost:8888/api/employee/profile/4
router.get('/employee/profile/:id', EmployeeController.getProfile);

// Link Điểm danh: POST http://localhost:8888/api/employee/check-in
router.post('/employee/check-in', EmployeeController.checkIn);

// Link xem Lương: http://localhost:8888/api/employee/salary/2
router.get('/employee/salary/:id', EmployeeController.getSalary);

module.exports = router;