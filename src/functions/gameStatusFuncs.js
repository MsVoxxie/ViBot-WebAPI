const Gamedig = require('gamedig');
const { sendWebhook } = require('./webHooks');

// Data
const color = {
	join: '#378c44',
	leave: '#37578c',
	state: '#ffffff',
	ready: '#27e864',
	start: '#91c734',
	stop: '#ebe234',
	msg: '#34bdeb',
	alert: '#eb8f34',
	err: '#eb3a34',
};

// Functions
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
					color: color.join,
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
					color: color.leave,
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
						await delay(60 * 1000);

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
							color: color.ready,
							description: `${CONNECTION_INFO}${SERVER_MOTD}${PLAYER_COUNT}`,
							URL: WEBURL,
						});
					} else {
						// Send the webhook
						await sendWebhook({
							title: `${SERVER_NAME} - Server ${DATA.curState}`,
							color: color.state,
							URL: WEBURL,
						});
					}
				}
				break;

			case 'sendMessage':
				await sendWebhook({
					title: `${SERVER_NAME} - Server Message`,
					color: color.msg,
					description: `${DATA.content}`,
					URL: WEBURL,
				});
				break;

			case 'sendAlert':
				await sendWebhook({
					title: `${SERVER_NAME} - Server Alert`,
					color: color.alert,
					description: `${DATA.content}`,
					URL: WEBURL,
				});
				break;

			case 'sendError':
				await sendWebhook({
					title: `${SERVER_NAME} - Server Error`,
					color: color.err,
					description: `${DATA.content}`,
					URL: WEBURL,
				});
				break;

			default:
				console.log(`Unknown: ${DATA.curState}`);
				break;
		}
	} catch (error) {
		return console.error(error);
	}
}

module.exports = {
	MinecraftCheck,
};
