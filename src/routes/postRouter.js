const {Router} = require('express');
const router = Router();

const {storePost, getPost} = require('../controller/postController');

router.post('/store/post', storePost);
router.get('/get/post', getPost);

module.exports = router;