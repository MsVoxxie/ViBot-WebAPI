const { sendWebhook } = require('../functions/webHooks');
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
router.get('/atm7', async (req, res) => {
	try {
		//Query the server
		const Query = await Gamedig.query({
			type: 'minecraft',
			host: 'play.voxxie.me',
			port: 25565,
		});

		//Server is online! Lets set stats
		servers.ATM7.ONLINE = true;
		(servers.ATM7.STARTING = false), (servers.ATM7.PLAYER_COUNT = Query.players.length);

		//Check that the server was previously offline or the player count changed
		if (!servers.ATM7.ONLINE || Query.players.length !== servers.ATM7.players) {
			//Set description formatting
			const currentPlayers = `\`\`\`Player Count: ${Query.players.length}/${Query.maxplayers}\`\`\``;
			const playerList = `${Query.players.length > 0 ? `\`\`\`Players: ${Query.players.map((player) => (player.name.length > 0 ? player.name : '<Unknown Player>')).join(', ')}\`\`\`` : ''}`;
			const serverMOTD = `${Query.name ? `\n\`\`\`css\nMOTD: ${Query.name}\`\`\`` : ''}`;

			// Send the webhook
			await sendWebhook({
				title: 'ATM7 Server - Online',
				description: `${serverMOTD}${currentPlayers}${playerList}`,
				URL: process.env.ATM7_WEBHOOK,
			});

			//Update the player count
			servers.ATM7.PLAYER_COUNT = Query.players.length;
		}

		//Send the response
		res.send({ status: 'online', players: Query.players.length });
		console.log('[ATM7] Requested', servers.ATM7);
	} catch (error) {
		//Server is offline!
		servers.ATM7.ONLINE = false;
		(servers.ATM7.STARTING = false), (servers.ATM7.PLAYER_COUNT = 0);

		//Check that the server was previously online
		if (servers.ATM7.ONLINE || servers.ATM7.STARTING) {
			// Send the webhook
			await sendWebhook({
				title: 'ATM7 Server - Offline',
				URL: process.env.ATM7_WEBHOOK,
			});

			console.log(`ATM7 Server - Offline`);

			//Update the player count
			servers.ATM7.PLAYER_COUNT = 0;
		}

		//Send the response
		res.send({ status: 'offline', players: 0 });
		console.log('[ATM7] Requested', servers.ATM7);
	}
});

module.exports = router;
