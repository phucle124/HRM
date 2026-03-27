//Chỉ dùng cho EJS (phía BE). Nếu không => thì ko dùng file này

const express = require('express');
const router = express.Router();

const { HomePage, LoginPage , LoginHandle, createPage, createUser, editUser, editPage, deleteUser, lockUser, createUserPage, editUserPage, createDepartmentPage, createDepartment, editDepartmentPage, editDepartment, deleteDepartment, admin_index, Logout} = require('../controller/HomeController');
const { validate_EditDepartment, validate_CreateDepartment } = require('../middleware/validate');



router.get('/', HomePage);

router.get('/login', LoginPage);

router.post('/login', LoginHandle);

router.get('/logout', Logout);


// redirect admin EJS
router.get('/admin-index', admin_index);


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