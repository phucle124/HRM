//Chỉ dùng cho EJS (phía BE). Nếu không => thì ko dùng file này

const express = require('express');
const router = express.Router();

const { HomePage, LoginPage , LoginHandle} = require('../controller/HomeController');
const { CreateUser } = require('../services/CRUDService');


router.get('/', HomePage);

router.get('/login', LoginPage);

router.post('/login', LoginHandle);

router.post('/create-user', CreateUser)

module.exports = router;