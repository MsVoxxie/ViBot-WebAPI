const router = require('express').Router();
const auth = require('./auth');
const discord = require('./discord');
const system = require('./system');
const canvas = require('./canvas');
const nyc = require('./nyc');

router.use('/auth', auth);
router.use('/discord', discord);
router.use('/system', system);
router.use('/canvas', canvas);
router.use('/nyc', nyc);

module.exports = router;
