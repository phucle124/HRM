const express = require('express');
const router = express.Router();
const EmployeeController = require('../controller/EmployeeController');
const DepartmentController = require('../controller/DepartmentController');
const HRController = require('../controller/HRController');
const ManagerController = require('../controller/ManagerController'); // Đã gộp lại một chỗ
const { 
    getAllUsers, getUserById, deleteUser, editUser, createUser, 
    LoginHandle, lockUser, getAllDepartments, getDepartmentById, 
    createDepartment, editDepartment, deleteDepartment, getEmployeesByDepartment, 
    SessionContain,
    getAllAttendances,
    assignManager
} = require('../controller/HomeController');
const { validateEmail, validatePassword, validatePhone } = require('../middlewares/validate');
const checkRole = require('../middlewares/Authorize');
const { Assign_Manager } = require('../services/CRUDService');
const checkRole2 = require('../middlewares/Authorize');


//Áp dụng middleware phân quyền cho API khác ngoài login,home,logout
// router.use((req, res, next) => {
//     if (req.path === '/login' || req.path === '/' || req.path === '/logout') return next();
//     checkRole(req, res, next);
// });



// --- DANH SÁCH API ---

// Auth API
router.post('/login', LoginHandle);
router.get('/session',checkRole, SessionContain);

// --- PUBLIC ENDPOINTS (Không cần auth) ---
router.get('/departments', getAllDepartments);
router.get('/departments/:id', getDepartmentById);
router.get('/departments/:id/employees', getEmployeesByDepartment);
router.get('/employees', HRController.getAllEmployees);
router.get('/employees/:id', HRController.getEmployeeById);
router.get('/attendance', getAllAttendances);

// --- PROTECTED ENDPOINTS (Cần auth) ---
//router.use(checkRole);

// User Management (Admin - Cần auth)
router.get('/users', checkRole2(["admin"]) ,getAllUsers); 
router.get('/users/:id', checkRole2(["admin"]),getUserById); 
router.post('/users', checkRole2(["admin"]), validateEmail, validatePassword, validatePhone, createUser); 
router.put('/users/:id', checkRole2(["admin"]), validateEmail, validatePassword, validatePhone, editUser);
router.delete('/users/:id', checkRole2(["admin"]), deleteUser); 
router.patch('/users/:id/lock', checkRole2(["admin"]),lockUser); 

// Department Management (Admin - Cần auth)
router.post('/departments', checkRole2(["admin"]),createDepartment);
router.put('/departments/:id', checkRole2(["admin"]), editDepartment);
router.delete('/departments/:id', checkRole2(["admin"]), deleteDepartment);
router.patch('/manager/:departmentId/assign', checkRole2(["admin"]), assignManager)

// Employee Management (HR - Cần auth)
router.post('/employees', checkRole2(["hr"]), HRController.createEmployee);
router.put('/employees/:id', checkRole2(["hr"]), HRController.updateEmployee);
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

// Gán tài khoản cho nhân viên và gửi mail thông báo
router.patch('/employees/:id/assign-user', HRController.assignUserAccount);

module.exports = router;