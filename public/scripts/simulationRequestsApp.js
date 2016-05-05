angular.module('simulationRequestsApp',[])
.factory('simulationRequestsService',['$http',
function($http)
{
	var service = {};
	service.requests = [];
	service.getSimulationRequests = function(res)
	{
		$http.get('/apis/requests')
			.success(function(data){
				service.requests=data;
				res(null,data);
			})
			.error(function(data)
			{
				res('Get simulation requests error: ' + data);
			});
	};
	service.createSimulationRequest = function(req,res)
	{
		if(name != "No Simulation")
		{
			$http.post('/apis/requests', {name:req.name,days:req.days})
			.success(function(data){
				service.requests=data;
				res(null,data);
			})
			.error(function(data)
			{
				res('Create simulation requests error: ' + data);
			});
		}
	};
	service.clearSimulationRequests = function(res)
	{
		$http.delete('/apis/requests')
			.success(function(data){
				service.requests=data;
				res(null,data);
			})
			.error(function(data){
				res('Clear simulation requests error: ' + data);
			});
	};
	service.deleteSimulationsRequests = function(req,res)
	{
		$http.delete('/apis/requests/' + req)
			.success(function(data){
				service.requests=data;
				res(null,data);
			})
			.error(function(data){
				res('Delete ' + name +' simulation request error: ' + data);
			});
	};
	service.processSimulationRequests = function(res)
	{
		$http.post('/apis/requests/process')
		.success(function(data){
			service.requests=data;
			res(null,data.requests);
		})
		.error(function(data){
			res('Process simulation requests error: ' + data);
		});	
	};
	return service;
}])
.controller('simulationRequestsController',['$scope','simulationRequestsService',
function($scope,simulationRequestsService)
{
	$scope.requests = simulationRequestsService.requests;

	$scope.deleteSimulationsRequests = function(name)
	{
		simulationRequestsService.getSimulationRequests(name,
			function(err,data)
			{
				if(err)
				{
					console.log(err);
				}
			});
	};

	$scope.startController = function()
	{
		simulationRequestsService.getSimulationRequests(
			function(err,data)
			{
				if(err)
				{
					console.log(err);
				}
			});
	};

	$scope.processSimulationRequests = function()
	{
		simulationRequestsService.processSimulationRequests(
			function(err,data)
			{
				if(err)
				{
					console.log(err);
				}
			});
	};
	$scope.startController();
}]);
