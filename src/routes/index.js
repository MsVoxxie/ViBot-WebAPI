const router = require('express').Router();
const auth = require('./auth');
const discord = require('./discord');
const system = require('./system');
const canvas = require('./canvas');

router.use('/auth', auth);
router.use('/discord', discord);
router.use('/system', system);
router.use('/canvas', canvas);

module.exports = router;
