const express = require('express');
const router = express.Router();

const { HomePage } = require('../controller/HomeController');

router.get('/users', HomePage);

module.exports = router;