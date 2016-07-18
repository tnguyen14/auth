require('dotenv').load();
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-google-oauth20').Strategy;
var cookieSession = require('cookie-session');
var cors = require('cors');

passport.use(new Strategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.URL + '/login/google/callback'
}, function (accessToken, refreshToken, profile, cb) {
	console.log('profile');
	console.log(profile);
	cb(null, profile);
}));

passport.serializeUser(function (user, cb) {
	console.log('serialize user');
	console.log(user);
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
	console.log('deserialize user');
	console.log(obj);
	cb(null, obj);
});

var app = express();

app.set('trust proxy', 1); // trust first proxy

var authorizedOrigins = process.env.AUTHORIZED_ORIGINS.split(',');
app.use(cors({
	origin: function (origin, callback) {
		callback(null, authorizedOrigins.indexOf(origin) !== -1);
	}
}));

app.use(cookieSession({
	name: 'inspiredev_session',
	secret: process.env.COOKIE_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login/google', passport.authenticate('google', {
	scope: ['profile']
}));

app.get('/login/google/callback',
	passport.authenticate('google', {failureRedirect: '/'}),
	function (req, res) {
		res.redirect('/');
	}
);

app.get('/profile', function (req, res) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		return res.sendStatus(401);
	}
	res.json(req.user);
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Express is listening.');
});
