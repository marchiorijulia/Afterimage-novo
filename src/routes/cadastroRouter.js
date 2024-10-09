const {Router} = require('express');
const router = Router();

const {storeCadastro} = require('../controller/cadastroController');

/**
 * @swagger
 * /store/cadastro:
 *  post:
 *    summary: Cadastra um novo usuário
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

router.post('/store/cadastro', storeCadastro);

module.exports = router;