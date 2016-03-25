var express = require('express');

var app = express();

app.get('/', function(req,res) {
	res.send('<h1>Hi, Obba</h1>');
})


app.listen('5800', function(req,res) {
	console.log('Now Obba is listening.')
})