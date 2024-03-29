const router = require('express').Router();
const { getBotGuilds, getUserGuilds, getBotData } = require('../util/api');
const { getMutualGuilds } = require('../util/utils');
const User = require('../database/schema/User');
const Guild = require('../database/schema/Guild');
const BotData = require('../database/schema/BotData');

router.get('/guilds', async (req, res) => {
	const guilds = await getBotGuilds();
	const user = await User.findOne({ discordID: req.user.discordID });
	if (user) {
		const userGuilds = await getUserGuilds(req.user.discordID);
		const mutualGuilds = await getMutualGuilds(userGuilds, guilds);
		res.send(mutualGuilds);
	} else {
		return res.status(401).send({ msg: 'Unauthorized' });
	}
});

router.get('/vibot', async (req, res) => {
	const data = await getBotData();
	if (data) {
		res.send(data);
	} else {
		return res.status(401).send({ msg: 'Failed to Receive Data' });
	}
});

router.get('/vibot/stats', async (req, res) => {
	const data = await BotData.findOne({});
	return data ? res.send(data) : res.status(404).send({ msg: 'Data Not Found' });
});

router.get('/guilds/:guildID/config', async (req, res) => {
	const { guildID } = req.params;
	const config = await Guild.findOne({ guildid: guildID });
	return config ? res.send(config) : res.status(404).send({ msg: 'Guild Not Found' });
});

// Guild API Calls

// Prefix
router.put('/guilds/:guildID/prefix', async (req, res) => {
	try {
		const prefix = await req.body.data;
		const { guildID } = req.params;
		if (!prefix) return res.status(400).send({ msg: 'prefix is required!' });
		const update = await Guild.findOneAndUpdate({ guildid: guildID }, { prefix }, { new: true });
		return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
	} catch (error) {
		console.log(error);
	}
});

// Guild Color
router.put('/guilds/:guildID/guildcolor', async (req, res) => {
	const guildcolor = await req.body.data;
	const { guildID } = req.params;
	if (!guildcolor) return res.status(400).send({ msg: 'guildcolor is required!' });
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { guildcolor }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// Prune
router.put('/guilds/:guildID/prune', async (req, res) => {
	const prune = await req.body.data;
	const { guildID } = req.params;
	if (!prune) return res.status(400).send({ msg: 'prune is required!' });
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { prune }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// Audit
router.put('/guilds/:guildID/audit', async (req, res) => {
	const audit = await req.body.data;
	const { guildID } = req.params;
	if (!audit) return res.status(400).send({ msg: 'audit is required!' });
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { audit }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// AuditChannel
router.put('/guilds/:guildID/auditchannel', async (req, res) => {
	const auditchannel = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { auditchannel }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// Welcome
router.put('/guilds/:guildID/welcome', async (req, res) => {
	const welcome = await req.body.data;
	const { guildID } = req.params;
	if (!welcome) return res.status(400).send({ msg: 'welcome is required!' });
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { welcome }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// WelcomeChannel
router.put('/guilds/:guildID/welcomechannel', async (req, res) => {
	const welcomechannel = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { welcomechannel }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// AllowInvites
router.put('/guilds/:guildID/allowinvites', async (req, res) => {
	const allowinvites = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { allowinvites }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// Invite Limit
router.put('/guilds/:guildID/invitelimit', async (req, res) => {
	const invitelimit = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { invitelimit }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// RulesChannel
router.put('/guilds/:guildID/ruleschannel', async (req, res) => {
	const ruleschannel = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { ruleschannel }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// StarChannel
router.put('/guilds/:guildID/starchannel', async (req, res) => {
	const starchannel = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { starchannel }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// TwitterChannel
router.put('/guilds/:guildID/twitterchannel', async (req, res) => {
	const twitterchannel = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { twitterchannel }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// TwitchChannel
router.put('/guilds/:guildID/twitchchannel', async (req, res) => {
	const twitchchannel = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { twitchchannel }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// BirthdayChannel
router.put('/guilds/:guildID/birthdaychannel', async (req, res) => {
	const birthdaychannel = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { birthdaychannel }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

// LevelChannel
router.put('/guilds/:guildID/levelchannel', async (req, res) => {
	const levelchannel = await req.body.data;
	const { guildID } = req.params;
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { levelchannel }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

//AntiSpam
router.put('/guilds/:guildID/spamdetection', async (req, res) => {
	const spamdetection = await req.body.data;
	const { guildID } = req.params;
	if (!spamdetection) return res.status(400).send({ msg: 'spamdetection is required!' });
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { spamdetection }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

//Kick accounts less than 2 weeks of age
router.put('/guilds/:guildID/kicknew', async (req, res) => {
	const kicknew = await req.body.data;
	const { guildID } = req.params;
	if (!kicknew) return res.status(400).send({ msg: 'kicknew is required!' });
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { kicknew }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

//Twitch Mention Everyone?
router.put('/guilds/:guildID/twitchmention', async (req, res) => {
	const twitchmention = await req.body.data;
	const { guildID } = req.params;
	if (!twitchmention) return res.status(400).send({ msg: 'twitchmention is required!' });
	const update = await Guild.findOneAndUpdate({ guildid: guildID }, { twitchmention }, { new: true });
	return update ? res.send(update) : res.status(400).send({ msg: 'Could not find document' });
});

module.exports = router;
