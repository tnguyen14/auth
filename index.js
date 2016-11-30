require('dotenv').load();
var express = require('express');
var app = express();
var auth = require('./lib/auth');

app.use('/', auth({
	cors: true
}));
var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Express is listening on port ' + port);
});

