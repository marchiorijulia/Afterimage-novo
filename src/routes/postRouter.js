const {Router} = require('express');
const router = Router();

const {storePost, getPost, storeTags} = require('../controller/postController');

router.post('/store/post', storePost);
router.get('/get/post', getPost);
router.get('/store/tags', storeTags);

module.exports = router;