'use strict';
//  Simulation Information apis	//
module.exports = function(app,cosmo) {
	//  Add a new simulation
	app.post('/apis/worlds', function(req,res)
	{
		cosmo.manager.createSimulation(req.body, 
			function(err,sims)
			{
				if(err) {
					// res.send(err);
					res.status = (err.status || 500);
					res.json(err);
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
					// res.send(err);
					// return;
					res.status = (err.status || 500);
					res.json(err);
				}
				else 
					res.json(packages);						
			});	
	});

	app.delete('/apis/worlds/', function(req,res)
	{
		cosmo.manager.clearSimulations(
			function(err,sims)
			{
				if(err)
				{
					res.status = (err.status || 500);
					res.json(err);
				}
				else
					res.json(sims);			
		});
	});

	//  Deletse a simulation
	app.delete('/apis/worlds/:name', function(req,res)
	{
		cosmo.manager.deleteSimulation(req.params.name,
			function(err,sims)
			{
				if(err){
					res.status = (err.status || 500);
					res.json(err);
				}
				else
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
					res.status = (err.status || 500);
					res.json(err);
			}
			else
				wres.json(glimpse);			
		});
	});

	app.get('/apis/worlds/:name/latest', function(req,res)
	{
		cosmo.manager.getSimulationContext(
			{
				name:req.params.name
			},
			function(err,sim) {
				if(err) {
					res.status = (err.status || 500);
					res.json(err);
				}
				else
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
					res.status = (err.status || 500);
					res.json(err);
				}
				else
				{
					res.json(timeline);
				}
			});
	});

	app.get('/apis/worlds/:name/:days', function(req,res)
	{
		cosmo.manager.getSimulationContext(
			{
				name: req.params.name
				,days: req.params.days
			},
			function(err,sim) {
				if(err) {
					res.status = (err.status || 500);
					res.json(err);
				}
				else
				{
					res.json(sim);
				}
			});
	});

	
};