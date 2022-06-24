const { ConvertRGBtoHex, HexToRgb } = require('../functions/colorFunctions');
const router = require('express').Router();
const axios = require('axios');

router.get('/colorlovers', async (req, res) => {
	const response = await axios.post(`http://www.colourlovers.com/api/palettes/random?format=json`);
	const data = response.data[0];
	const colors = data.colors.map((c) => `#${c}`);
	res.send(colors);
});

router.get('/colormind', async (req, res) => {
	const response = await axios.post('http://colormind.io/api/', { model: 'default' });
	const data = response.data.result;
	const colors = [];

	for (let i = 0; i < data.length; i++) {
		let Hex = ConvertRGBtoHex(data[i][0], data[i][1], data[i][2]);
		colors.push(Hex.toUpperCase());
	}
	res.send(colors);
});

module.exports = router;
