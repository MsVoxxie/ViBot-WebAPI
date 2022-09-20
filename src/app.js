require('dotenv').config();
require('./strategies/discord');

const ms = require('ms');
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cors = require('cors');
const Store = require('connect-mongo');

const https = require('https');
const app = express();
const PORT = process.env.PORT || 3002;
const routes = require('./routes');

async function startApp() {
	console.log('App Starting...');
	console.log('Connecting to MongoDB...');

	try {
		mongoose.connect(process.env.DB_CREDS, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
	} catch (err) {
		console.log('Error connecting to MongoDB');
		return process.exit(1);
	}

	console.log('Connected to MongoDB');

	mongoose.connection.on('connected', () => {
		console.log('Connected to Database');
	});
	mongoose.connection.on('err', (err) => {
		return process.exit(1);
	});
	mongoose.connection.on('disconnect', () => {
		console.log('Database Disconnected');
		return process.exit(1);
	});

	const limiterTimeout = 1 * 60 * 1000; // 1 minutes

	const limiter = rateLimit({
		windowMs: limiterTimeout,
		max: 1000,
		message: `Woah there buckaroo, Looks like you're trying to do something naughty! Sit in the timeout corner for ${ms(limiterTimeout, { long: true })}!`,
	});

	app.use(limiter);
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use(cors({ origin: process.env.CORS.split(' '), credentials: true }));

	app.use(
		session({
			secret: process.env.COOKIE_SECRET,
			cookie: {
				httpOnly: true,
				secure: true,
				maxAge: 60 * 1000 * 60 * 24 * 7,
			},
			resave: false,
			saveUninitialized: false,
			store: Store.create({ mongoUrl: process.env.DB_CREDS }),
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	const AUTH = {
		privateKey: fs.readFileSync('/etc/letsencrypt/live/api.voxxie.me/privkey.pem', 'utf8'),
		certificate: fs.readFileSync('/etc/letsencrypt/live/api.voxxie.me/fullchain.pem', 'utf8'),
		ca: fs.readFileSync('/etc/letsencrypt/live/api.voxxie.me/chain.pem', 'utf8'),
	};

	app.use('/api', routes);
	console.log('Starting Server...');
	https.createServer({ key: AUTH.privateKey, cert: AUTH.certificate, ca: AUTH.ca }, app).listen(PORT, () => console.log(`Server Started on port: ${PORT}`));
}

startApp();
