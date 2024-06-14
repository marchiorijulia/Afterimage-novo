const {Router} = require('express');
const router = Router();

const {storeTask} = require('../controller/task.Controller');
<<<<<<< HEAD

router.post('/store/task', storeTask);
=======
const {storePost} = require('../controller/task.Controller');

router.post('/store/task', storeTask);
router.post('/store/task', storePost);
>>>>>>> fd3e9e72dcd8aa70484fb34c9b1e1e07f52ecdba

module.exports = router;