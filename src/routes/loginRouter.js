const { Router } = require('express');
const router = Router();
const { storeLogin, getUserById } = require('../controller/loginController');

router.post('/store/login', storeLogin);

router.get('/get/users/perfil/:id', getUserById);

module.exports = router;