//Chỉ dùng cho EJS (phía BE). Nếu không => thì ko dùng file này

const express = require('express');
const router = express.Router();

const { HomePage, LoginPage , LoginHandle, createUser, editUser, editUserPage, deleteUser, lockUser, createUserPage, createDepartment, createDepartmentPage, editDepartment, deleteDepartment, editDepartmentPage, Logout} = require('../controller/HomeController');



router.get('/', HomePage);

router.get('/login', LoginPage);

router.post('/login', LoginHandle);

router.get('/logout', Logout);


// CRUD Users
router.get('/create-userPage', createUserPage);

router.post('/create-user', createUser);

router.get('/edit-user/:id', editUserPage);

router.post('/edit-user',editUser);

router.get('/delete-user/:id',deleteUser);

router.post('/lock/:id', lockUser); //Lock hoặc Unlock tài khoản 

// CRUD Departments
router.get('/create-departmentPage', createDepartmentPage);

router.post('/create-department', createDepartment);

router.get('/edit-department/:id', editDepartmentPage);

router.post('/edit-department', editDepartment);

router.get('/delete-department/:id', deleteDepartment);

module.exports = router;