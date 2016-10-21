require('dotenv').load();
var express = require('express');
var app = express();
var auth = require('./lib/auth');

app.use('/', auth({
	cors: true
}));
app.listen(process.env.PORT || 3000, function () {
	console.log('Express is listening.');
});

