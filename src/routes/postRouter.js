const {Router} = require('express');
const router = Router();

const {storePost, getPost} = require('../controller/postController');

/**
 * @swagger
 * /store/post:
 *  post:
 *    summary: Salva uma nova postagem de um usuário logado
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

router.post('/store/post', storePost);

/**
 * @swagger
 * /get/post:
 *  get:
 *    summary: Exibe todos os posts
 *    responses:
 *      200:
 *        description: Lista de posts
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 */
router.get('/get/post', getPost);

module.exports = router;