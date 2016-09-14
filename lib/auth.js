var express = require('express');
var passport = require('passport');
var Strategy = require('passport-google-oauth20').Strategy;
var cookieSession = require('cookie-session');
var cors = require('cors');
var pick = require('lodash.pick');
var debug = require('debug')('auth');

passport.use(new Strategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.AUTH_URL + '/login/google/callback'
}, function (accessToken, refreshToken, profile, cb) {
	debug('auth callback: accessToken %s', accessToken);
	cb(null, Object.assign({}, profile, {
		accessToken: accessToken,
		refreshToken: refreshToken
	}));
}));

passport.serializeUser(function (user, cb) {
	debug('serialize user: accessToken %s', user.accessToken);
	cb(null, pick(user, ['id', 'displayName', 'name', 'photos', 'gender', 'provider', 'accessToken', 'refreshToken']));
});

passport.deserializeUser(function (obj, cb) {
	debug('deserialize user: accesToken %s', obj.accessToken);
	cb(null, obj);
});

var app = express();

app.set('trust proxy', 1); // trust first proxy

app.use(cookieSession({
	name: process.env.COOKIE_NAME,
	secret: process.env.COOKIE_SECRET,
	domain: process.env.COOKIE_DOMAIN
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login/google', function (req, res, next) {
	if (req.query.redirect) {
		req.session.redirect = req.query.redirect;
	}
	next();
}, function (req, res, next) {
	var opts = {
		scope: ['profile']
	};
	if (req.query.scope) {
		opts.scope = req.query.scope.split(' ');
		opts.includeGrantedScopes = true;
	}
	debug('Authenticate with Google with opts %s', opts);
	passport.authenticate('google', opts)(req, res, next);
});

app.get('/login/google/callback',
	passport.authenticate('google', {failureRedirect: '../../profile'}),
	function (req, res) {
		var redirectUrl = '../../profile';
		if (process.env.REDIRECT_URL) {
			redirectUrl = process.env.REDIRECT_URL;
		}
		if (req.session.redirect) {
			redirectUrl = req.session.redirect;
			delete req.session.redirect;
		}
		debug('Callback from Google, redirecting to %s', redirectUrl);
		res.redirect(redirectUrl);
	}
);

app.get('/profile', function (req, res) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		debug('User is not authenticated');
		return res.sendStatus(401);
	}
	res.json(req.user);
});

module.exports = function (opts) {
	if (opts && opts.cors) {
		var authorizedOrigins = process.env.AUTHORIZED_ORIGINS.split(',');
		app.use(cors({
			origin: function (origin, callback) {
				callback(null, authorizedOrigins.indexOf(origin) !== -1);
			},
			credentials: true
		}));
	}
	return app;
};
