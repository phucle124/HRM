const express = require('express');
const router = express.Router();
// const DepartmentController = require('../controller/DepartmentController');
// Nếu bạn có dùng cả HRController thì thêm luôn dòng dưới:
const HRController = require('../controller/HRController');

const { getAllUsers, getUserById, deleteUser, editUser, createUser, LoginHandle, lockUser, getAllDepartments, getDepartmentById, createDepartment, editDepartment, deleteDepartment, getEmployeesByDepartment } = require('../controller/HomeController');

//Danh sách API (cần gửi về FE)

router.post('/login', LoginHandle);

router.get('/users', getAllUsers); //Get all colums users (chuc nang cua admin)
router.get('/users/:id', getUserById); //Get user by ID (chuc nang cua admin)
router.post('/users', createUser); //(chuc nang cua admin)
router.put('/users/:id',editUser) //(chuc nang cua admin)
router.delete('/users/:id', deleteUser); //(chuc nang cua admin)
router.patch('/users/:id/lock',lockUser); // Lock/Unlock các tài khoản users (chức năng của admin)

router.get('/departments',getAllDepartments); //Get all columns Departments (chức năng của admin)
router.get('/departments/:id', getDepartmentById);
router.post('/departments', createDepartment);
router.put('/departments/:id', editDepartment);
router.delete('/departments/:id', deleteDepartment);
router.get('/departments/:id/employees', getEmployeesByDepartment);

// Employee Management API
router.get('/employees', HRController.getAllEmployees);
router.post('/employees', HRController.createEmployee);
router.get('/employees/:id', HRController.getEmployeeById);
router.put('/employees/:id', HRController.updateEmployee);
router.delete('/employees/:id', HRController.deleteEmployee);

module.exports = router;