const { Router } = require('express');
const router = Router();
const { storeLogin, getUserById } = require('../controller/loginController');

/**
 * @swagger
 * /store/login:
 *  post:
 *    summary: Faz o login do usuário
 *    responses:
 *      201:
 *        description: Sucesso!
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 */

router.post('/store/login', storeLogin);

/**
 * @swagger
 * /get/users/perfil/:id:
 *  get:
 *    summary: Pega as informações do usuário logado e as exibe na página de perfil
 *    responses:
 *      200:
 *        description: Página de perfil
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 */

router.get('/get/users/perfil/:id', getUserById);

module.exports = router;