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



//  Pages
app.get('/new-sim', function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/new-sim.html'));
});

app.get('/about', function(req,res)
{
	res.sendFile(path.join(__dirname + 'public/about.html'));
});

//  Load main page with top world, playing at newest possibel date
app.get('/', function(req,res)
{
	res.sendFile(path.join(__dirname + 'public/index.html'));
});
//  Load main page with inputted world, playing at newest possible date
app.get('/worlds/:worldname',function(req,res)
{
	res.sendFile(path.join(__dirname + 'public/index.html'));
});
//  Load main page with inputted world at date, not playing
app.get('/worlds/:worldname/:year/:month/:day',function(req,res)
{
	res.sendFile(path.join(__dirname + 'public/index.html'));
});

//  API's 	//

//  Request API

//  Get all simulation requests
app.get('/apis/requests',function(req,res)
{
	cosmo.getSimulationRequests(function(err,requests)
		{
			if(err)
				res.send(err);
			res.json(requests);
		});
});
//  Post new simulation request
app.post('/apis/requests',function(req,res)
{
	cosmo.queueSimulationRequest(req.body,
		function(err,requests)
		{
			if(err)
				res.send(err);
			res.json(requests);
		});
});
//  Clear simulation requests
app.delete('/apis/requests',function(req,res)
{
	console.log("Deleting requests with: " + req.body);

	cosmo.clearSimulationRequests(
		function(err,requests)
		{
			if(err)
				res.send(err);
			res.json(requests);
		});
});
//  Delete all simulation requests of worldname
app.delete('/apis/requests/:name',function(req,res)
{
	cosmo.deleteSimulationRequestsForWorld(req.params,
		function(err,requests)
		{
			if(err)
				res.send(err);
			res.json(requests);
		});
});
app.post('/apis/requests/process',function(req,res)
{
	cosmo.processSimulationRequests(
		function(err,requestsAndSimulations)
		{
			if(err)
				res.send(err);
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
			if(err)
				res.send(err);

			res.json(sims);			
			
		});	
});

//  Get all the simulations
app.get('/apis/worlds', function(req,res)
{
	cosmo.getSimulations(
		function(err,sims)
		{
			if(err)
				res.send(err);

			res.json(sims);			
			
		});	
});

//  Deletse a simulation
app.delete('/apis/worlds/:name', function(req,res)
{
	cosmo.deleteSimulation(req.params.name,
		function(err,sims)
		{
			if(err)
				res.send(err);

			res.json(sims);			
	});
});

app.delete('/apis/worlds/', function(req,res)
{
	cosmo.clearSimulations(
		function(err,sims)
		{
			if(err)
				res.send(err);

			res.json(sims);			
	});
});


//  Gets the current date of all the sims
app.get('/apis/worlds/current-date', function(req,res)
{

});

//  Gets the current date of the simulation so that you dont pull redundant data
app.get('/apis/worlds/current-date/:worldname', function(req,res)
{

});

//  Gets the current data of a world
app.get('/apis/worlds/current-world-data/:worldname', function(req,res)
{
	 
	console.log(req.params.worldname);
});

//  Get teh world data at a specifc date
app.get('/apis/worlds/world-data/:worldname/:day/:month/:year', function(req,res)
{

});

//  Starts a simulation if it is not currently running
app.post('/apis/worlds/start/:worldname',function(req,res)
{

});

//  Stops a simulation if it is currently running
app.post('/apis/worlds/stop/:worldname',function(req,res)
{
	
});

app.listen(3000);


