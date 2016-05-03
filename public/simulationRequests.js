angular.module('simulationRequestsApp',[]);
requests.controller('requestController',['$scope','$http'],
function($scope,$http)
{
	$scope.getSimulationRequests = function()
	{
		$http.get('/apis/requests')
			.success(function(data){
				$scope.simulationRequests = data;
			})
			.error(function(data)
			{
				console.log('Get simulation requests error: ' + data);
			});
	};
	$scope.createSimulationRequest = function(name,days)
	{
		if(name != "No Simulation")
		{
			$http.post('/apis/requests', {name:name,days:days})
			.success(function(data){
				$scope.requestData = {};
				$scope.simulationRequests = data;
			})
			.error(function(data)
			{
				console.log('Create simulation requests error: ' + data);
			});
		}
	};
	$scope.clearSimulationRequests = function()
	{
		$http.delete('/apis/requests')
			.success(function(data){
				$scope.simulationRequests = data;
			})
			.error(function(data){
				console.log('Clear simulation requests error: ' + data);
			});
	};
	$scope.deleteSimulationsRequests = function(name)
	{
		$http.delete('/apis/requests/' + name)
			.success(function(data){
				$scope.simulationRequests = data;
			})
			.error(function(data){
				console.log('Delete ' + name +' simulation request error: ' + data);
			});
	};
	$scope.processSimulationRequests = function()
	{
		$http.post('/apis/requests/process')
		.success(function(data){
			$scope.simulationRequests = data.requests;
			$scope.sims = data.simulations;
			$scope.updateCurrent();
		})
		.error(function(data){
			console.log('Process simulation requests error: ' + data);
		});	
	};
});