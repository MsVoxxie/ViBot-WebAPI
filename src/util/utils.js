const CryptoJS = require('crypto-js');

async function getMutualGuilds(userGuilds, botGuilds) {
	const validGuilds = await userGuilds.filter((guild) => (guild.permissions & 0x20) === 0x20);
	const included = [];
	const excluded = validGuilds.filter((guild) => {
		const findGuild = botGuilds.find((g) => g.id === guild.id);
		if (!findGuild) return guild;
		included.push(findGuild);
	});
	return { excluded, included };
}

function encrypt(token) {
	return CryptoJS.AES.encrypt(token, process.env.CRYPTO_SECRET);
}

function decrypt(token) {
	return CryptoJS.AES.decrypt(token, process.env.CRYPTO_SECRET);
}

module.exports = { getMutualGuilds, encrypt, decrypt };
