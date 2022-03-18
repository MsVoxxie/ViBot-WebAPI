const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const User = require('../database/schema/User');
const OAuth2Credentials = require('../database/schema/OAuth2Credentials');
const { encrypt } = require('../util/utils');

passport.serializeUser((user, done) => {
	done(null, user.discordID);
});

passport.deserializeUser(async (discordID, done) => {
	try {
		const user = await User.findOne({ discordID });
		return user ? done(null, user) : done(null, null);
	} catch (error) {
		console.log(error);
		done(error, null);
	}
});

passport.use(
	new DiscordStrategy(
		{
			clientID: process.env.DASH_CLIENT_ID,
			clientSecret: process.env.DASH_CLIENT_SECRET,
			callbackURL: process.env.DASH_CALLBACK_URL,
			scope: ['identify', 'guilds'],
		},
		async (accessToken, refreshToken, profile, done) => {
			const encrptedAccessToken = encrypt(accessToken).toString();
			const encryptedRefreshToken = encrypt(refreshToken).toString();

			const { id, username, discriminator, avatar, guilds } = profile;
			try {
				const findUser = await User.findOneAndUpdate(
					{ discordID: id },
					{
						discordTag: `${username}#${discriminator}`,
						avatar: avatar,
						guilds: guilds,
					},
					{ new: true }
				);

				const findCredentials = await OAuth2Credentials.findOneAndUpdate(
					{ discordID: id },
					{
						accessToken: encrptedAccessToken,
						refreshToken: encryptedRefreshToken,
					}
				);

				if (findUser) {
					if (!findCredentials) {
						const newCredentials = await OAuth2Credentials.create({
							accessToken: encrptedAccessToken,
							refreshToken: encryptedRefreshToken,
							discordID: id,
						});
					}
					return done(null, findUser);
				} else {
					const newUser = await User.create({
						discordID: id,
						discordTag: `${username}#${discriminator}`,
						avatar: avatar,
						guilds: guilds,
					});

					const newCredentials = await OAuth2Credentials.create({
						accessToken: encrptedAccessToken,
						refreshToken: encryptedRefreshToken,
						discordID: id,
					});

					return done(null, newUser);
				}
			} catch (error) {
				console.log(error);
				return done(error, null);
			}
		}
	)
);
