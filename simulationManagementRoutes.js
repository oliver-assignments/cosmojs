'use strict';
//  Simulation Information apis	//
module.exports = function(app,cosmo) {
	//  Add a new simulation
	var descripto = require('cosmo').manager.getSimulationDescriptions;

	app.post('/apis/worlds', function(req,res)
	{
		cosmo.manager.createSimulation(req.body, 
			function(err,sims)
			{
				if(err) {
					res.send(err);
				}
				else {
					res.json(sims);			
				}
			});	
	});

	//  Get all the simulation descriptions
	app.get('/apis/worlds/description', function(req,res)
	{
		cosmo.manager.getSimulationDescriptions(
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
		cosmo.manager.deleteSimulation(req.params.name,
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
		cosmo.manager.clearSimulations(
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
	app.get('/apis/worlds/:name/decription', function(req,res)
	{
		//  Return name, dimensions 
		cosmo.manager.getSimulationPackage(
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

	app.get('/apis/worlds/:name/current', function(req,res)
	{
		cosmo.manager.getSimulation(req.params.name,
			function(err,sim) {
				if(err) {
					res.send(err);return;
				}
				res.json(sim);
			});
	});
	app.get('/apis/worlds/:name/:year/:month/:day', function(req,res)
	{
		cosmo.manager.getSimulation(req.params.name,
			function(err,sim) {
				if(err) {
					res.send(err);return;
				}
				res.json(sim);
			});
	});

	//  Get all the saved date names
	app.get('/apis/worlds/:name/timeline', function(req,res)
	{
		cosmo.manager.getSimulationTimeline(req.params.name,
			function(err,timeline) {
				if(err)
				{
					res.send(err);
				}
				else
				{
					res.json(timeline);
				}
			});
	});
};