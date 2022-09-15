const { sendWebhook } = require('../functions/webHooks');
const { MinecraftCheck } = require('../functions/gameStatusFuncs');
const router = require('express').Router();
const Gamedig = require('gamedig');
require('dotenv').config();

//Globals
const servers = {
	ATM7: {
		PLAYER_COUNT: 0,
		ONLINE: false,
		STARTING: true,
	},
	KF2: {
		PLAYER_COUNT: 0,
		ONLINE: false,
		STARTING: true,
	},
};

// Minecraft / ATM7
router.post('/atm7', async (req, res) => {
	await MinecraftCheck('ATM7', process.env.SERVER_IP, 25565, req.body, process.env.ATM7_WEBHOOK);
});

// Minecraft / ATM8
router.post('/atm8', async (req, res) => {
	await MinecraftCheck('ATM8', process.env.SERVER_IP, 25569, req.body, process.env.ATM8_WEBHOOK);
});

// Garry's Mod / Wirebox
router.post('/wirebox', async (req, res) => {
	try {
		//Query the server
		const Query = await Gamedig.query({
			type: 'garrysmod',
			host: process.env.SERVER_IP,
			port: 27020,
		});
	} catch (error) {}
});

module.exports = router;
