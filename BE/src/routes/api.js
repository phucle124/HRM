const express = require('express');
const router = express.Router();

const { HomePage } = require('../controller/HomeController');

//Danh sách API (cần gửi về FE)

router.get('/', HomePage);

module.exports = router;