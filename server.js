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

//  Pages
app.get('/new', function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/newsim.html'));
});

app.get('/about', function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/about.html'));
});

//  Load main page with top world, playing at newest possibel date
app.get('/', function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/index.html'));
});
//  Load main page with inputted world, playing at newest possible date
app.get('/worlds/:name',function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/index.html'));
});
//  Load main page with inputted world at date, not playing
app.get('/worlds/:name/:year/:month/:day',function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

//  API's 	//

//  Request API

//  Get all simulation requests
app.get('/apis/requests',function(req,res)
{
	cosmo.getSimulationRequests(function(err,requests)
		{
			if(err){
				res.send(err);
				return;
			}
			res.json(requests);
		});
});
//  Post new simulation request
app.post('/apis/requests',function(req,res)
{
	cosmo.queueSimulationRequest(req.body,
		function(err,requests)
		{
			if(err){
				res.send(err);
				return;
			}
			res.json(requests);
		});
});
//  Clear simulation requests
app.delete('/apis/requests',function(req,res)
{
	cosmo.clearSimulationRequests(
		function(err,requests)
		{
			if(err){
				res.send(err);
				return;
			}
			res.json(requests);
		});
});
//  Delete all simulation requests of worldname
app.delete('/apis/requests/:name',function(req,res)
{
	cosmo.deleteSimulationRequestsForWorld(req.params,
		function(err,requests)
		{
			if(err){
				res.send(err);
				return;
			}

			res.json(requests);
		});
});
app.post('/apis/requests/process',function(req,res)
{
	cosmo.processSimulationRequests(
		function(err,requestsAndSimulations)
		{
			if(err){
				res.send(err);
				return;
			}
			res.json(requestsAndSimulations);
		});
});

//  Renderer API

//  Return color delta file comparing what is passed to what is requested
app.get('/apis/renderer/:worldname/:year/:month/:day',function(req,res)
{

});

//  Simulation Information API

//  Add a new simulation
app.post('/apis/worlds', function(req,res)
{	
	cosmo.createSimulation(req.body, 
		function(err,sims)
		{
			if(err){
				res.send(err);
				return;
			}

			res.json(sims);			
			
		});	
});

//  Get all the simulations
app.get('/apis/worlds/package', function(req,res)
{
	cosmo.getSimulationPackages(
		function(err,packages)
		{
			if(err){
				res.send(err);
				return;
			}

			res.json(packages);			
			
		});	
});

//  Deletse a simulation
app.delete('/apis/worlds/:name', function(req,res)
{
	cosmo.deleteSimulation(req.params.name,
		function(err,sims)
		{
			if(err){
				res.send(err);
				return;
			}

			res.json(sims);			
	});
});

app.delete('/apis/worlds/', function(req,res)
{
	cosmo.clearSimulations(
		function(err,sims)
		{
			if(err)
			{
				res.send(err);
				return;
			}
			res.json(sims);			
	});
});

//  Get the basic pacakge of world
app.get('/apis/worlds/:name/package', function(req,res)
{
	//  Return name, dimensions 
	cosmo.getSimulationPackage(
		req.params.name,
		function(err,glimpse)
		{
			if(err){
				res.send(err);
			return;
		}


			res.json(glimpse);			
	});
});

//  Gets the current data of a world
app.get('/apis/worlds/:name/current/:mode', function(req,res)
{
	cosmo.renderSimulation({name:req.params.name,mode:req.params.mode},
		function(err,colors) {
			if(err) {
				res.send(err);return;
			}
			res.json(colors);
		});
	
});
app.get('/apis/worlds/:name/current', function(req,res)
{
	cosmo.getSimulation(req.params.name,
		function(err,sim) {
			if(err) {
				res.send(err);return;
			}
			res.json(sim);
		});
	
});

//  Get teh world data at a specifc date
app.get('/apis/worlds/:name/:year/:month/:day/:mode', function(req,res)
{

});

//  Utility
app.get('/apis/utility/name/generate',function(req,res)
{
	res.send(utility.generateName(utility.randomNumberBetween(5,8)));
});

app.listen(3000);


