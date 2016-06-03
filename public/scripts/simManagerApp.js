angular.module('simulationManagerApp',[])
.factory('simulationManagerService', ['$http', 'simulationRendererService', 'timelineService','pageService','contextService',
function($http,renderer,timeline,pager,context)
{
	var manager = {};
	manager.simulations = [];

	manager.pickRandom = function(res)
	{
		if(manager.simulations.length>0) {
			var index = Math.floor(Math.random() * manager.simulations.length);
			manager.pickSim(manager.simulations[index].name,res); 
			res(null);
		}
		else
		{
			res("Cannot pick random if there are no simulations.")
		}
	};
	manager.pickSim = function(name,res)
	{
		for(var s = 0 ; s < manager.simulations.length;s++)
		{
			if(manager.simulations[s].name == name)
			{
				context.name = name;
				pager.changePage('Home');

				//update dates
				timeline.getDates(function(err,data)
					{
						if(err)
						{
							res(err);
						}
						else
						{
							//  pick latest date
							timeline.pickLatestDate(function(err,data)
							{
								if(err){
									console.log(err);
								}
							});
						}
					});

				
			}
		}
		res(null);
	};
	manager.pickSimIndex = function(i)
	{
		if(manager.simulations.length>0)
		{
			if(i < manager.simulations.length) 
			{
				manager.pickSim(manager.simulations[i].name);
			}
		}
	};

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
.controller('simulationManagerController',['$scope','simulationManagerService','contextService','utilityService',
function($scope,simulationManager,context,utility)
{
	$scope.simulationManager = simulationManager;
	$scope.context = context;
	$scope.utility = utility;

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
					simulationManager.pickRandom(function(err)
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
		simulationManager.pickSim(name, 
			function(err)
			{
				if(err){
					console.log(err);
				}
			});
	};
	$scope.startController();
}]);