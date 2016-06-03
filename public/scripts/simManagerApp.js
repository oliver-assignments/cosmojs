angular.module('simulationManagerApp',[])
.factory('pickerService',['$http','simulationManagerService','pageService','simulationRendererService','timelineService',
function($http,manager,pager,renderer,timeline)
{
	var picker = {};
	picker.name = "No Simulation";
	picker.day = 1;
	picker.month = 1;
	picker.year = 1;

	picker.getSim = function(res)
	{
		if(picker.name == "No Simulation")
		{
			res("Simulation hasn't been picked yet.");
		}
		else
		{
			res(null,picker);
		}
	};

	picker.pickRandom = function(res)
	{
		if(manager.simulations.length>0) {
			var index = Math.floor(Math.random() * manager.simulations.length);
			picker.pickSim(manager.simulations[index].name,res); 
			res(null);
		}
		else
		{
			res("Cannot pick random if there are no simulations.")
		}
	};
	picker.pickSim = function(name,res)
	{
		for(var s = 0 ; s < manager.simulations.length;s++)
		{
			if(manager.simulations[s].name == name)
			{
				picker.name = name;
				pager.changePage('Home');

				//update dates
				timelineService.getDates(name,function(err,data)
					{
						if(err)
						{
							res(err);
						}
						else
						{
							//  pick latest date
							timelineService.pickLatestDate(function(err,data)
							{
								console.log(err);
							});

							//  This renders today as well
						}
					});

				
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
	picker.pickDate = function(date)
	{
		picker.year = date.year;
		picker.month = date.month;
		picker.day = date.day;
	}
	picker.resetPickedSim = function()
	{	
		picker = 
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

	manager.getSimulationDescriptions = function(res)
	{
		$http.get('/apis/worlds/description')
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
				manager.simulations = data;
				res(null,data);
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
			})	
			.error(function(data)
			{
				res('Delete sim error: ' + data);
			
			});	
	};
	
	return manager;
}])
.controller('simulationManagerController',['$scope','simulationManagerService','pickerService',
function($scope,simulationManager,picker)
{
	$scope.simulationManager = simulationManager;
	$scope.picker = picker;

	$scope.startController = function()
	{
		simulationManager.getSimulationDescriptions(
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
					});
				}
			});
	};

	$scope.pickSim = function(name)
	{
		picker.pickSim(name, 
			function(err)
			{
				if(err){
					console.log(err);
				}
			});
	};
	$scope.startController();
}]);