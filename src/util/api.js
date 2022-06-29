const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const OAuth2Credentials = require('../database/schema/OAuth2Credentials');
const { decrypt } = require('../util/utils');
const TOKEN = process.env.BOT_TOKEN;

const DISCORD_API = 'http://discord.com/api/v9/';

async function getBotGuilds() {
	const response = await fetch(`${DISCORD_API}users/@me/guilds`, {
		method: 'GET',
		headers: {
			Authorization: `Bot ${TOKEN}`,
		},
	});
	return response.json();
}

async function getBotData() {
	const response = await fetch(`${DISCORD_API}/oauth2/applications/@me`, {
		method: 'GET',
		headers: {
			Authorization: `Bot ${TOKEN}`,
		},
	});
	return response.json();
}

async function getUserGuilds(discordID) {
	const credentials = await OAuth2Credentials.findOne({ discordID: discordID });
	if (!credentials) throw new Error('No Credentials.');
	const encryptedAccessToken = credentials.get('accessToken');
	const decrypted = decrypt(encryptedAccessToken);
	const accessToken = decrypted.toString(CryptoJS.enc.Utf8);

	const response = await fetch(`${DISCORD_API}users/@me/guilds`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.json();
}

module.exports = { getBotGuilds, getUserGuilds, getBotData };
