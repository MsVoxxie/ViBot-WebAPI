const { sendWebhook } = require('../functions/webHooks');
const router = require('express').Router();
const Gamedig = require('gamedig');

let oldPlayerCount = null;

// Minecraft / ATM7
router.get('/atm7', async (req, res) => {
	try {
		//Query the server
		const Query = await Gamedig.query({
			type: 'minecraft',
			host: 'play.voxxie.me',
			port: 25565,
		});

		//Set the server status to online
		if (oldPlayerCount !== Query.players.length) {
			const webHookData = {
				title: 'ATM7 Server - Online',
				description: `Players: ${Query.players.length}/${Query.maxplayers}`,
				URL: 'https://discord.com/api/webhooks/997607208504275014/itjVBTcjhHcWyo6Jlk5Q-z8fhm9lxDqf6v-NOnuukDU5kqRZsk2hBK5NC6RWux7VNezo',
			};

			if (Query.players.length > 0) {
				webHookData.fieldName = 'Players';
				webHookData.fieldValue = `\`\`\`${Query.players.map((player) => player.name).join(', ')}\`\`\``;
			}

			sendWebhook(webHookData);
			oldPlayerCount = Query.players.length;
			res.json({ online: true });
		}
	} catch (error) {
		//Set the server status to offline
		if (oldPlayerCount !== oldPlayerCount) {
			sendWebhook({
				title: 'ATM7 Server - Offline',
				URL: 'https://discord.com/api/webhooks/997607208504275014/itjVBTcjhHcWyo6Jlk5Q-z8fhm9lxDqf6v-NOnuukDU5kqRZsk2hBK5NC6RWux7VNezo',
			});
			oldPlayerCount = null;
			res.json({ online: false });
		}
	}
});

module.exports = router;
