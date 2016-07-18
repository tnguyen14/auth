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
	cb(null, profile);
}));

passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
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

app.get('/login/google', passport.authenticate('google'));

app.get('/login/google/callback',
	passport.authenticate('google', {failureRedirect: '/'}),
	function (req, res) {
		res.redirect('/');
	}
);

app.get('/profile',
	require('connect-ensure-login').ensureLoggedIn({
		redirectTo: process.env.URL + '/login/google'
	}),
	function (req, res) {
		res.json(req.user);
	}
);

app.listen(process.env.PORT || 3000, function () {
	console.log('Express is listening.');
});
