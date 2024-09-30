const {Router} = require('express');
const router = Router();

const {storePost, getPost, listTags} = require('../controller/postController');

router.post('/store/post', storePost);
router.get('/get/post', getPost);
router.get('/tags/list', listTags);

module.exports = router;