//Chỉ dùng cho EJS (phía BE). Nếu không => thì ko dùng file này

const express = require('express');
const router = express.Router();

const { HomePage, LoginPage , LoginHandle, createPage, createUser, editUser, editPage, deleteUser, lockUser} = require('../controller/HomeController');



router.get('/', HomePage);

router.get('/login', LoginPage);

router.post('/login', LoginHandle);

router.get('/logout', HomePage);


// CRUD Users
router.get('/create', createPage);

router.post('/create-user', createUser);

router.get('/edit/:id', editPage);

router.post('/edit-user',editUser);

router.get('/delete/:id',deleteUser);

router.post('/lock/:id', lockUser); //Lock hoặc Unlock tài khoản 

module.exports = router;