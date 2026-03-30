const express = require('express');
const router = express.Router();
const DepartmentController = require('../controller/DepartmentController');
// Nếu bạn có dùng cả HRController thì thêm luôn dòng dưới:
const HRController = require('../controller/HRController');

const { getAllUsers, getUserById, deleteUser, editUser, createUser, LoginHandle, lockUser, getAllDepartments, getDepartmentById, createDepartment, editDepartment, deleteDepartment } = require('../controller/HomeController');

//Danh sách API (cần gửi về FE)

router.post('/login', LoginHandle);

router.get('/users', getAllUsers); //Get all colums users (chuc nang cua admin)
router.get('/users/:id', getUserById); //Get user by ID (chuc nang cua admin)
router.post('/users', createUser); //(chuc nang cua admin)
router.put('/users/:id',editUser) //(chuc nang cua admin)
router.delete('/users/:id', deleteUser); //(chuc nang cua admin)
router.patch('/users/:id/lock',lockUser); // Lock/Unlock các tài khoản users (chức năng của admin)

router.get('/departments', DepartmentController.getAllDepartments);
router.post('/departments', DepartmentController.createDepartment);
router.get('/departments/:id', DepartmentController.getDepartmentById);
router.put('/departments/:id', DepartmentController.updateDepartment);
router.delete('/departments/:id', DepartmentController.deleteDepartment);
router.get('/departments/:id/employees', DepartmentController.getEmployeesInDepartment);

// Employee Management API
router.get('/employees', HRController.getAllEmployees);
router.post('/employees', HRController.createEmployee);
router.get('/employees/:id', HRController.getEmployeeById);
router.put('/employees/:id', HRController.updateEmployee);
router.delete('/employees/:id', HRController.deleteEmployee);

module.exports = router;