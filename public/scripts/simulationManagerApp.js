angular.module('simulationManagerApp',[])
.factory('pickerService',['simulationManagerService',
function(manager)
{
	var picker = {};
	picker.pickedSim = {};

	picker.pickSim = function(name)
	{
		$http.get('/apis/worlds/'+name+'/package')
		.success(function(data) {
			picker.pickedSim = data;
			//renderer.updateColors(manager.pickedSim.name,renderer.mode);
		})
		.error(function(data){
			console.log('Simulation package error ' + data);
		});
	
	}
	picker.pickSimIndex = function(i)
	{
		if(manager.simulations.length>0)
		{
			if(i < manager.simulations.length) 
			{
				picker.pickSim(manager.simulations[i].name);
			}
		}
		else
		{
			picker.resetPickedSim();
		}
	};
	picker.resetPickedSim = function()
	{	
		picker.pickedSim = 
		{
			name:"No Simulation",
			month:1,
			day:1,
			year:1,
			columns: 1,
			rows: 1,
			colors: {}
		};
		//renderer.mapMode = "Satellite";
		//renderer.clearColors();
	};
	picker.resetPickedSim();

	return picker;
}])
.factory('simulationManagerService', ['$http', 'simulationRendererService',
function($http,renderer)
{
	var manager = {};
	manager.simulations = [];

	manager.getSims = function()
	{
		$http.get('/apis/worlds/package')
			.success(function(data){
				// var pick = false;
				// if(!$scope.sims || $scope.sims.length == 0)
				// {
				// 	pick = true;
				// }
				manager.simulations = data;

				// if(pick)
				// {
				// 	$scope.pickSimIndex(
				// 		Math.floor((Math.random() * ($scope.sims.length))));
				// }
				// $scope.updateCurrent();
			})
			.error(function(data)
			{
				res('Cannot find simulations. ' + data);
			});
	};
	

	manager.createSim = function(form)
	{
		$http.post('/apis/worlds', form)
			.success(function(data) {

				//$scope.fillNameBlank();
				manager.simulations = data;
				//$scope.pickSim($scope.formData.name);
				//$scope.formData = {};
			})
			.error(function(data)
			{
				res('Create sim error: ' + data);
			});
	};
	manager.deleteSim = function(name) 
	{
		//console.log("Attempting to delete " + id);
		
		$scope.deleteSimulationsRequests(name);

		$http.delete('/apis/worlds/' + name)
			.success(function(data)
			{
				 manager.simulations = data;

				// if(name == $scope.pickedSim.name)
				// {
				// 	$scope.pickSimIndex(0);	
				// }
			})	
			.error(function(data)
			{
				res('Delete sim error: ' + data);
			
			});		
	};

	manager.clearSims = function()
	{
		//console.log('Attempting to delete all sims.');

		$http.delete('/apis/worlds/')
			.success(function(data)
			{
				manager.simulations = data;
				//$scope.clearPickedSim();
			})	
			.error(function(data)
			{
				res('Delete sim error: ' + data);
			
			});	
	};
	
	return manager;
}])
.controller('simulationManagerController',['$scope','simulationManagerService','simulationManagerService',
function($scope,simulationManager,simulationManagerService)
{
	$scope.simulations = simulationManager.simulations;

	$scope.pickedSim = simulationManager.pickedSim;

	$scope.pickSim=function(name)
	{
		simulationManager.pickSim(name);
	};
}]);