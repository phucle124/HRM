const express = require('express');
const router = express.Router();

const { AllUsersData, UserByIdData, deleteUser, editUser, createUser, LoginHandle } = require('../controller/HomeController');

//Danh sách API (cần gửi về FE)

router.post('/login', LoginHandle);

router.get('/users', AllUsersData); //Get all users (chuc nang cua admin)
router.get('/users/:id', UserByIdData); //Get user by ID (chuc nang cua admin)
router.post('/users', createUser); //(chuc nang cua admin)
router.put('/users/:id',editUser) //(chuc nang cua admin)
router.delete('/users/:id', deleteUser); //(chuc nang cua admin)



module.exports = router;