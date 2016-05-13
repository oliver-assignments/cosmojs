// var http = require('http');
// var dispatch = require("httpdispatcher");
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

var cosmo = require('cosmo');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

app.use(express.static(__dirname + '/public/css'));

//  Load main page with top world, playing at newest possibel date
app.get('/', function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

console.log(cosmo);
//  Routes
require('./simulationRequestRoutes')(app,cosmo);
require('./simulationManagementRoutes')(app,cosmo);
require('./simulationRenderRoutes')(app,cosmo);

//  Utility
app.get('/apis/utility/name/generate',function(req,res)
{
	res.send(utility.generateName(utility.randomNumberBetween(5,8)));
});

app.listen(3000);


