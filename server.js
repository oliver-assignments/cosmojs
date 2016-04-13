// var http = require('http');
// var dispatch = require("httpdispatcher");
var express = require("express");
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

mongoose.connect('mongodb://localhost/cosmo');

app.get('/new-sim', function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/new-sim.html'));
});

app.get('/about', function(req,res)
{
	res.sendFile(path.join(__dirname + 'public/about.html'));
});

app.get('/', function(req,res)
{
	res.sendFile(path.join(__dirname + 'public/index.html'));
});

//  Cosmo API	//
var Simulations = mongoose.model('Simulations', 
{
	name: String,
	date: String
});

//  Add a new simulation
app.post('/apis/worlds', function(req,res)
{	
	cosmo.createSimulation(
		req.body.name,
		function(err, cosmoSim) {
			if(err)
				res.send(err);
		});

	//Create world
	Simulations.create(
		{
			name: req.body.name,
			date: "Jannon 1st, 0 B.C."
		}, 
		function(err,sim)
		{
			if(err)
				res.send(err);

			//  Now that we have a new sim
			Simulations.find(function(err,sims) {
				
				if(err)
					res.send(err);

				res.json(sims);			
			});
		});	
});

//  Get all the simulations
app.get('/apis/worlds', function(req,res)
{
	Simulations.find(function(err,sims){
			if(err)
				res.send(err);

			res.json(sims);			
		});
});

//  Detele a simulation
app.delete('/apis/worlds/:sim_id', function(req,res)
{
	Simulations.remove({
		_id : req.params.sim_id

	}, function(err,sim){

		if(err)
			res.send(err);

		Simulations.find(function(err,sims){
			if(err)
				res.send(err);

			res.json(sims);			
		});
	});
});

app.delete('/api/worlds/', function(req,res)
{
	Simulations.remove({}, 
		function(err,sim){

		if(err)
			res.send(err);

		Simulations.find(function(err,sims){
			if(err)
				res.send(err);

			res.json(sims);			
		});
	});
});

// //  Navigate to index but with this world selected
// app.get('/apis/worlds/:worldname', function(req,res)
// {
	
// 	console.log(req.params.worldname);
// });

// //  Gets the current date of all the sims
// app.get('/apis/worlds/current-date', function(req,res)
// {

// });

// //  Gets the current date of the simulation so that you dont pull redundant data
// app.get('/apis/worlds/current-date/:worldname', function(req,res)
// {

// });

// //  Gets the current data of a world
// app.get('/apis/worlds/current-world-data/:worldname', function(req,res)
// {
	 
// 	console.log(req.params.worldname);
// });

// //  Get teh world data at a specifc date
// app.get('/apis/worlds/world-data/:worldname/:day/:month/:year', function(req,res)
// {

// });

//  Starts a simulation if it is not currently running
app.post('/apis/worlds/start/:worldname',function(req,res)
{

});

//  Stops a simulation if it is currently running
app.post('/apis/worlds/stop/:worldname',function(req,res)
{
	
});

app.listen(3000);


