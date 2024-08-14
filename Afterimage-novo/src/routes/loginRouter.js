const { Router } = require('express');
const router = Router();
const { storeLogin } = require('../controller/loginController');

router.post('/store/login', storeLogin);

module.exports = router;