const {Router} = require('express');
const router = Router();

const {storeTask} = require('../controller/task.Controller');

router.post('/store/task', storeTask);

module.exports = router;