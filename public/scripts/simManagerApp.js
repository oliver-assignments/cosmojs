angular.module('simulationManagerApp',[])
.factory('pickerService',['$http','simulationManagerService',
function($http,manager)
{
	var picker = {};
	picker.pickedSim = pickedSim = 
		{
			name:"No Simulation",
			month:1,
			day:1,
			year:1,
			columns: 1,
			rows: 1,
			colors: {}
		};
	picker.pickRandom = function(res)
	{
		picker.pickSim(manager.simulations[Math.floor(Math.random() * manager.simulations.length)].name,res); 
	};
	picker.pickSim = function(name,res)
	{
		for(var s = 0 ; s < manager.simulations.length;s++)
		{
			if(manager.simulations[s].name == name)
			{
				console.log(manager.simulations[s].month);
				picker.pickedSim = manager.simulations[s];
			}
		}
		res(null);
	};
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


	return picker;
}])
.factory('simulationManagerService', ['$http', 'simulationRendererService',
function($http,renderer)
{
	var manager = {};
	manager.simulations = [];

	manager.getSims = function(res)
	{
		$http.get('/apis/worlds/package')
			.success(function(data){
				manager.simulations = data;
				res(null,data);
			})
			.error(function(data)
			{
				res('Cannot find simulations. ' + data);
			});
	};
	

	manager.createSim = function(form,res)
	{
		$http.post('/apis/worlds', form)
			.success(function(data) {

				//$scope.fillNameBlank();
				manager.simulations = data;
				res(null,data);
				//$scope.pickSim($scope.formData.name);
				//$scope.formData = {};
			})
			.error(function(data)
			{
				res('Create sim error: ' + data);
			});
	};
	manager.deleteSim = function(name,res) 
	{
		//console.log("Attempting to delete " + id);
		
		$scope.deleteSimulationsRequests(name);

		$http.delete('/apis/worlds/' + name)
			.success(function(data)
			{
				 manager.simulations = data;
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
				manager.simulations = data;
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
.controller('simulationManagerController',['$scope','simulationManagerService','pickerService','utilityService','simulationRendererService','timelineService',
function($scope,simulationManager,picker,utility,renderer,timeline)
{
	$scope.simulationManager = simulationManager;
	$scope.picker = picker;

	$scope.utility = utility;

	$scope.startController = function()
	{
		simulationManager.getSims(
			function(err,data)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					picker.pickRandom(function(err)
						{
							if(err)
							{
								console.log(err);
							}
							else
							{
								//We picked one!
							}
						});
				}
			});
	};

	$scope.pickSim=function(name)
	{
		picker.pickSim(name, 
			function(err)
			{
				if(err){
					console.log(err);
				}
				else
				{
					timeline.stop();
					renderer.updateColors(picker.pickedSim.name,
						function(err,data)
						{
							if(err)console.log(err);
						});
				}
			});
	};
	$scope.startController();
}]);