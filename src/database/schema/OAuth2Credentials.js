const mongoose = require('mongoose');

const OAuth2CredentialsSchema = new mongoose.Schema({
	accessToken: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	discordID: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Oauth2Credentials', OAuth2CredentialsSchema);
