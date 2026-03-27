const express = require('express');
const router = express.Router();

const { getAllUsers, getUserById, deleteUser, editUser, createUser, LoginHandle, lockUser, getAllDepartments, getDepartmentById, createDepartment, editDepartment, deleteDepartment } = require('../controller/HomeController');

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

module.exports = router;