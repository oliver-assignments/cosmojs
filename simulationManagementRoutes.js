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
					res.send(err);
				}
				else {
					res.json(sims);			
				}
			});	
	});

	//  Get all the simulations
	app.get('/apis/worlds/package', function(req,res)
	{
		cosmo.manager.getSimulationPackages(
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
	app.get('/apis/worlds/:name/package', function(req,res)
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