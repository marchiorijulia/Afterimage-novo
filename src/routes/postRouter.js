const {Router} = require('express');
const router = Router();

const {storePost, getPost, listTags} = require('../controller/postController');
const { listTags } = require('../controllers/tagsController');

router.post('/store/post', storePost);
router.get('/get/post', getPost);
router.get('/tags/listar', listTags);

module.exports = router;