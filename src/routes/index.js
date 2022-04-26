const router = require('express').Router();
const auth = require('./auth');
const discord = require('./discord');
const system = require('./system');

router.use('/auth', auth);
router.use('/discord', discord);
router.use('/system', system);

module.exports = router;
