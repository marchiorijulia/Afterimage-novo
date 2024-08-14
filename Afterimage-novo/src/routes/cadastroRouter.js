const {Router} = require('express');
const router = Router();

const {storeCadastro} = require('../controller/cadastroController');

router.post('/store/cadastro', storeCadastro);

module.exports = router;