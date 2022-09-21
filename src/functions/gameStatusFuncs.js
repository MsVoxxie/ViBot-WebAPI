const Gamedig = require('gamedig');
const { sendWebhook } = require('./webHooks');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function MinecraftCheck(NAME = String, IP = String, PORT = Number, SERVER_DATA = Object, WEBURL = String) {
	try {
		//Declare Variables
		const SERVER_NAME = NAME;
		const DATA = SERVER_DATA;
		let QUERY;
		let PLAYER_COUNT;
		let SERVER_MOTD;
		let playerList = [];
		let playerFinal = '';

		switch (DATA.action) {
			//User Connected
			case 'Join':
				//QUERY the server
				QUERY = await Gamedig.query({
					type: 'minecraft',
					host: IP,
					port: PORT,
					givenPortOnly: true,
					maxAttempts: 10,
				});

				PLAYER_COUNT = `\`\`\`css\nPlayer Count: ${QUERY.players.length}/${QUERY.maxplayers}\`\`\``;
				SERVER_MOTD = QUERY.name.split('Version').map((s) => s.trim());
				SERVER_MOTD = `${QUERY.name ? `\`\`\`css\nMOTD: ${SERVER_MOTD[0]}\nVersion: ${SERVER_MOTD[1]}\`\`\`` : ''}`;

				//Push each player to the list
				playerList.push(`+ ${DATA.user}`);
				QUERY.players.map((p) => {
					if (p.name !== DATA.user) {
						playerList.push(`› ${p.name}`);
					}
				});

				//Finalize the player list
				playerFinal = `\`\`\`diff\nPlayers:\n${playerList.join('\n')}\`\`\``;

				//Send the webhook
				await sendWebhook({
					title: `${SERVER_NAME} - Player Connected`,
					description: `${SERVER_MOTD}${PLAYER_COUNT}${playerFinal}`,
					URL: WEBURL,
				});
				break;

			//User Disconnected
			case 'Leave':
				//QUERY the server
				QUERY = await Gamedig.query({
					type: 'minecraft',
					host: IP,
					port: PORT,
					givenPortOnly: true,
					maxAttempts: 10,
				});

				PLAYER_COUNT = `\`\`\`css\nPlayer Count: ${QUERY.players.length}/${QUERY.maxplayers}\`\`\``;
				SERVER_MOTD = QUERY.name.split('Version').map((s) => s.trim());
				SERVER_MOTD = `${QUERY.name ? `\`\`\`css\nMOTD: ${SERVER_MOTD[0]}\nVersion: ${SERVER_MOTD[1]}\`\`\`` : ''}`;

				//Push each player to the list
				playerList.push(`- ${DATA.user}`);
				QUERY.players.map((p) => {
					if (p.name !== DATA.user) {
						playerList.push(`› ${p.name}`);
					}
				});

				//Finalize the player list
				playerFinal = `\`\`\`diff\nPlayers:\n${playerList.join('\n')}\`\`\``;

				//Send the webhook
				await sendWebhook({
					title: `${SERVER_NAME} - Player Disconnected`,
					description: `${SERVER_MOTD}${PLAYER_COUNT}${playerFinal}`,
					URL: WEBURL,
				});
				break;

			//Server State Changed
			case 'stateChange':
				// Make sure the states are different
				if (DATA.oldState !== DATA.curState) {
					if (DATA.curState === 'Ready') {
						//Wait
						await delay(90 * 1000);

						//QUERY the server
						QUERY = await Gamedig.query({
							type: 'minecraft',
							host: IP,
							port: PORT,
							givenPortOnly: true,
							maxAttempts: 10,
						});

						CONNECTION_INFO = `\`\`\`css\nIP: ${IP} PORT: ${PORT}\`\`\``;
						PLAYER_COUNT = `\`\`\`css\nPlayer Count: ${QUERY.players.length}/${QUERY.maxplayers}\`\`\``;
						SERVER_MOTD = QUERY.name.split('Version').map((s) => s.trim());
						SERVER_MOTD = `${QUERY.name ? `\`\`\`css\nMOTD: ${SERVER_MOTD[0]}\nVersion: ${SERVER_MOTD[1]}\`\`\`` : ''}`;

						await sendWebhook({
							title: `${SERVER_NAME} - Server ${DATA.curState}`,
							description: `${CONNECTION_INFO}${SERVER_MOTD}${PLAYER_COUNT}`,
							URL: WEBURL,
						});
					} else {
						// Send the webhook
						await sendWebhook({
							title: `${SERVER_NAME} - Server ${DATA.curState}`,
							URL: WEBURL,
						});
					}
				}
				break;

			default:
				console.log(`Unknown: ${DATA.curState}`);
				break;
		}
	} catch (error) {
		return console.error('ERROR');
	}
}

module.exports = {
	MinecraftCheck,
};
