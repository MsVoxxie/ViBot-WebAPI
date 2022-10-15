const router = require('express').Router();
// const gamestatus = require('./gamestatus');
const discord = require('./discord');
const canvas = require('./canvas');
const health = require('./health');
const system = require('./system');
const auth = require('./auth');
const nyc = require('./nyc');

//Use Routes
// router.use('/gamestatus', gamestatus);
router.use('/discord', discord);
router.use('/canvas', canvas);
router.use('/health', health);
router.use('/system', system);
router.use('/auth', auth);
router.use('/nyc', nyc);

module.exports = router;
