const router = require('express').Router();

router.get('/', (req, res) => {
	const health = {
		uptime: process.uptime(),
		responsetime: process.hrtime(),
		message: 'OK',
		timestamp: Date.now(),
	};
	try {
		res.send(health);
	} catch (error) {
		health.message = error.message;
		res.status(503).send();
	}
});

module.exports = router;
