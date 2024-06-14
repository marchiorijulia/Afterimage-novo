const {Router} = require('express');
const router = Router();

const {storeTask} = require('../controller/task.Controller');
const {storePost} = require('../controller/task.Controller');

router.post('/store/task', storeTask);
router.post('/store/task', storePost);

module.exports = router;