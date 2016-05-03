angular.module('simulationManagerApp',[])
.factory('simulationManagerService', ['$http',
function($http)
{
	var manager = {};
	
	manager.getSims = function(res)
	{
		$http.get('/apis/worlds/package')
			.success(function(data){
				// var pick = false;
				// if(!$scope.sims || $scope.sims.length == 0)
				// {
				// 	pick = true;
				// }
				res(null,data);

				// if(pick)
				// {
				// 	$scope.pickSimIndex(
				// 		Math.floor((Math.random() * ($scope.sims.length))));
				// }
				// $scope.updateCurrent();
			})
			.error(function(data)
			{
				res('Cannot find simulations. ' +data);
			});
	};
	

	manager.createSim = function(req,res)
	{
		$http.post('/apis/worlds', req)
			.success(function(data) {

				//$scope.fillNameBlank();
				res(null,data);
				//$scope.pickSim($scope.formData.name);
				//$scope.formData = {};
			})
			.error(function(data)
			{
				res('Create sim error: ' + data);
			});
	};
	manager.deleteSim = function(req,res) 
	{
		//console.log("Attempting to delete " + id);
		
		$scope.deleteSimulationsRequests(name);

		$http.delete('/apis/worlds/' + name)
			.success(function(data)
			{
				 res(null,data);

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

	manager.clearSims = function(res)
	{
		//console.log('Attempting to delete all sims.');

		$http.delete('/apis/worlds/')
			.success(function(data)
			{
				res(null,data);
				//$scope.clearPickedSim();
			})	
			.error(function(data)
			{
				res('Delete sim error: ' + data);
			
			});	
	};

	return manager;
}])
.controller('simulationManagerController',['$scope','simulationManagerService',
function($scope,simulationManagerService)
{
	$scope.simulations = [];

	$scope.pickedSim = 
	{
		name:"No Simulation",
		month:1,
		day:1,
		year:1,
		columns: 1,
		rows: 1,
		colors: {}
	};
	$scope.pickSimIndex = function(i)
	{
		if($scope.sims.length>0)
		{
			if(i < $scope.sims.length) 
			{
				$scope.pickSim($scope.sims[i].name);
			}
		}
		else
		{
			$scope.clearPickedSim();
		}
	};

	$scope.pickSim = function(name)
	{
		$http.get('/apis/worlds/'+name+'/package')
		.success(function(data) {
			$scope.pickedSim = data;
			$scope.updateColors($scope.pickedSim.name,$scope.mapMode);
		})
		.error(function(data){
			console.log('Simulation package error ' + data);
		});
	};

	$scope.clearPickedSim = function()
	{
		$scope.pickedSim = 
		{
			name:"No Simulation",
			month:1,
			day:1,
			year:1,
			columns: 1,
			rows: 1,
			colors: {}
		};
		$scope.mapMode = "Satellite";
		$scope.clearColors();
	};
	
	
	$scope.updateCurrent = function()
	{
		for(var s = 0 ; s < $scope.sims.length ; s++)
		{
			if($scope.sims[s].name == $scope.pickedSim.name)
			{
				$scope.pickedSim = $scope.sims[s];
				return;
			}
		}
		$scope.pickSimIndex(Math.floor((Math.random() * ($scope.sims.length))));
	};

	$scope.startController = function()
	{
		simulationManagerService.getSims(function(err,data)
		{
			if(err)
			{
				console.log(err);
			}	
			else
			{
				console.log(data);
				$scope.simulations = data;
			}
		});
	};
	$scope.startController();
}]);