const express = require('express');
const router = express.Router();

const { AllUsersData, UserByIdData } = require('../controller/HomeController');

//Danh sách API (cần gửi về FE)
router.get('/users', AllUsersData); //Get all users
router.get('/users/:id', UserByIdData); //Get user by ID



module.exports = router;