var express = require('express');
var passport = require('passport');
var Strategy = require('passport-google-oauth20').Strategy;

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
	require('connect-ensure-login').ensureLoggedIn(),
	function (req, res) {
		res.json(req.user);
	}
);

app.listen(process.env.PORT || 3000, function () {
	console.log('Express is listening.');
});
