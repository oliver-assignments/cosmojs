module.exports = function(app,cosmo) {

    //  Get all simulation requests
	app.get('/apis/requests',function(req,res)
	{
		cosmo.requester.getSimulationRequests(function(err,requests)
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
		cosmo.requester.queueSimulationRequest(req.body,
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
		cosmo.requester.clearSimulationRequests(
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
		cosmo.requester.deleteSimulationRequestsForWorld(req.params,
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
		cosmo.requester.processSimulationRequests(
			function(err,requestsAndSimulations)
			{
				if(err){
					res.send(err);
					return;
				}
				res.json(requestsAndSimulations);
			});
	});
};


