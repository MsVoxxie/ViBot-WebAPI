require('dotenv').config();
require('./strategies/discord');

const fs = require('fs');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const Store = require('connect-mongo');

const https = require('https');
const app = express();
const PORT = process.env.PORT || 3002;
const routes = require('./routes');

mongoose.connect(process.env.DB_CREDS, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
	cors({
		origin: ['https://bot.voxxie.me', 'http://localhost:3002', 'http://192.168.0.110:3002'],
		credentials: true,
	})
);

app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		cookie: {
			maxAge: 60 * 1000 * 60 * 24 * 7,
		},
		resave: false,
		saveUninitialized: false,
		store: Store.create({
			mongoUrl: process.env.DB_CREDS,
		}),
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

https.createServer({
	key: fs.readFileSync('./ssl/privkey.pem'),
	cert: fs.readFileSync('./ssl/fullchain.pem')
}, app)
.listen(PORT, '0.0.0.0', () => console.log(`Running on ${PORT}`));