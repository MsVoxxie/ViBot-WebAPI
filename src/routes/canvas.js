const router = require('express').Router();
const axios = require('axios');

router.get('/palette', async (req, res) => {
	const response = await axios.post('http://www.colourlovers.com/api/palettes/random?format=json');
	const data = response.data[0];
	const colors = data.colors;

	res.send(colors);
});

module.exports = router;
