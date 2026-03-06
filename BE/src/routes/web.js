const express = require('express');
const router = express.Router();

const { HomePage } = require('../controller/HomeController');

router.get('/', HomePage);

module.exports = router;