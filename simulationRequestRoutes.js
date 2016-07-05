'use strict';
module.exports = function(app,cosmo) {
    //  Get all simulation requests
	app.get('/apis/requests',function(req,res)
	{
		cosmo.requests.getSimulationRequests(function(err,requests)
			{
				if(err){
					res.status = (err.status || 500);
						res.render('error', {
					        message: err,
					        error: err
					    });
					//res.send(err);
					//return;
				}
				res.json(requests);
			});
	});
	//  Post new simulation request
	app.post('/apis/requests',function(req,res)
	{
		cosmo.requests.queueSimulationRequest(req.body,
			function(err,requests)
			{
				if(err){
					res.status = (err.status || 500);
						res.render('error', {
					        message: err,
					        error: err
					    });
					// res.send(err);
					// return;
				}
				res.json(requests);
			});
	});
	//  Clear simulation requests
	app.delete('/apis/requests',function(req,res)
	{
		cosmo.requests.clearSimulationRequests(
			function(err,requests)
			{
				if(err){
					res.status = (err.status || 500);
						res.render('error', {
					        message: err,
					        error: err
					    });
					// res.send(err);
					// return;
				}
				res.json(requests);
			});
	});
	//  Delete all simulation requests of worldname
	app.delete('/apis/requests/:name',function(req,res)
	{
		cosmo.requests.deleteSimulationRequestsForWorld(req.params,
			function(err,requests)
			{
				if(err){
					res.status = (err.status || 500);
						res.render('error', {
					        message: err,
					        error: err
					    });
					// res.send(err);
					// return;
				}

				res.json(requests);
			});
	});
	app.post('/apis/requests/process',function(req,res)
	{
		cosmo.requests.processSimulationRequests(
			function(err,requests)
			{
				if(err){
					res.status = (err.status || 500);
						res.render('error', {
					        message: err,
					        error: err
					    });
					// res.send(err);
					// return;
				}
				res.json(requests);
			});
	});
};


