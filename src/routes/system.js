const router = require('express').Router();
const diskspace = require('diskspace');
const moment = require('moment');
const os = require('os');

router.get('/statistics', async (req, res) => {
	//Convert OS Uptime to time;
	const uptime = getDuration(Date.now() - os.uptime * 1000, Date.now());
	const diskUsage = await getDisk();
	const cpuAverage = (os.loadavg()[0] + os.loadavg()[1] + os.loadavg()[2]) / 3;

	const stats = {
		Hostname: os.hostname(),
		Uptime: uptime.map((t) => t).join(' '),
		Cpus: os.cpus().length,
		CpuUsage: Math.floor(cpuAverage * 10),
		TotalMem: Math.floor(os.totalmem() / (1000 * 1000 * 1000)),
		FreeMem: Math.floor(os.freemem() / (1000 * 1000 * 1000)),
		UsedMem: Math.floor((os.totalmem() - os.freemem()) / (1000 * 1000 * 1000)),
		DiskTotal: Math.floor((await diskUsage.total) / (1000 * 1000 * 1000)),
		DiskFree: Math.floor((await diskUsage.free) / (1000 * 1000 * 1000)),
		DiskUsage: Math.floor((await diskUsage.used) / (1000 * 1000 * 1000)),
		Platform: os.platform(),
	};
	return res.send(stats);
});

function getDisk() {
	return new Promise((resolve, reject) => {
		diskspace.check('/', (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});
}

function getDuration(startDate, endDate) {
	let parts = [];
	const period = moment(endDate).diff(startDate);
	const duration = moment.duration(period);
	if (!duration || duration.toISOString() === 'P0D') return;
	if (duration.years() >= 1) {
		const years = Math.floor(duration.years());
		parts.push(years + ' ' + (years > 1 ? 'Years' : 'Year'));
	}
	if (duration.months() >= 1) {
		const months = Math.floor(duration.months());
		parts.push(months + ' ' + (months > 1 ? 'Months' : 'Month'));
	}
	if (duration.days() >= 1) {
		const days = Math.floor(duration.days());
		parts.push(days + ' ' + (days > 1 ? 'Days' : 'Day'));
	}
	if (duration.hours() >= 1) {
		const hours = Math.floor(duration.hours());
		parts.push(hours + ' ' + (hours > 1 ? 'Hours' : 'Hour'));
	}
	if (duration.minutes() >= 1) {
		const minutes = Math.floor(duration.minutes());
		parts.push(minutes + ' ' + (minutes > 1 ? 'Minutes' : 'Minute'));
	}
	const seconds = Math.floor(duration.seconds());
	parts.push(seconds + ' ' + (seconds == 1 ? 'Second' : 'Seconds'));
	return parts;
}

module.exports = router;
