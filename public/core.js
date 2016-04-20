var cosmoApp = angular.module('cosmoApp', []);

cosmoApp.controller('WorldController', ['$scope',"$http",
function($scope,$http){
	$scope.formData = {};
	$scope.requestData = {};



	$scope.months = [
	"January", "February", "March", "April",
	"May", "June", "July", "August", 
	"September", "October","November","December"
	];
	$scope.modes = [
		{name:"Geo",     modes : ["Depth","Height","Tectonic","Satellite"]},
		{name:"Weather", modes : ["Sunlight", "Rainfall"]},
		{name:"Soil",    modes : ["Nutro", "Nucium", "Nutrients"]},
		{name:"Plant",   modes : ["Nutro Stores", "Nucium Stores", "Water Stores", "Nutrient Stores"]}
	];

	$scope.currentSimulation = {};
	$scope.currentMapSetting = $scope.modes[0].modes[0];
	$scope.playing = false;

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
	$scope.createSimulationRequest = function(name,years)
	{
		//console.log('Creating simulation request for ' + name + ' for ' + years + ' year.');
		$http.post('/apis/requests', {name:name,years:years})
		.success(function(data){
			$scope.requestData = {};
			$scope.simulationRequests = data;
		})
		.error(function(data)
		{
			console.log('Create simulation requests error: ' + data);
		});
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
		console.log('Attempting to delete all ' + name + " requests.")
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
		})
		.error(function(data){
			console.log('Process simulation requests error: ' + data);
		});	
	};

	$scope.pickFirstSim = function()
	{
		if($scope.sims.length>0){
			$scope.currentSimulation = $scope.sims[0];
		}
		else{
			$scope.currentSimulation = {};
		}
	};

	$scope.pickLastSim = function(){
		if($scope.sims.length>0){
			$scope.currentSimulation = $scope.sims[$scope.sims.length-1];
		}
		else{
			$scope.currentSimulation = {};
		}
	};

	$scope.pickSim = function(sim)
	{
		$scope.currentSimulation = sim;
	};

	$scope.getSims = function()
	{
		$http.get('/apis/worlds')
			.success(function(data){
				$scope.sims = data;
			})
			.error(function(data)
			{
				console.log('Cannot find simulations. ' +data);
			});
	};

	$scope.createSim = function()
	{
		//console.log("Attempting to create " + $scope.formData.name);

		$http.post('/apis/worlds', $scope.formData)
			.success(function(data){
				console.log(data);
				$scope.formData = {};
				$scope.sims = data;
				$scope.pickLastSim();
			})
			.error(function(data)
			{
				console.log('Create sim error: ' + data);
			});
	};
	$scope.deleteSim = function(id) 
	{
		//console.log("Attempting to delete " + id);
		
		$scope.deleteSimulationsRequests(id);

		$http.delete('/apis/worlds/' + id)
			.success(function(data)
			{
				$scope.sims = data;
				$scope.pickFirstSim();
			})	
			.error(function(data)
			{
				console.log('Delete sim error: ' + data);
			
			});		
	};

	$scope.getCurrentOfWorld = function(name)
	{
		$http.get('/apis/worlds/current-world-data/' + name)
			.success(function(data)
			{

			})
			.error(function(data)
			{
				console.log('Get snapshot error: ' + data);
			});
	};

	$scope.getSimAtDate= function(name,month,day,year)
	{
		$http.get('/apis/worlds/world-data/' + name + '/'+ month + '/'+ day + '/'+ year)
			.success(function(data)
			{
				console.log(data);
			})
			.error(function(data)
			{
				console.log('Get snapshot error: ' + data);
			});
	};

	$scope.clearSims = function()
	{
		//console.log('Attempting to delete all sims.');

		$http.delete('/apis/worlds/')
			.success(function(data)
			{
				$scope.sims = data;
				$scope.pickFirstSim();
			})	
			.error(function(data)
			{
				console.log('Delete sim error: ' + data);
			
			});	
	};

	$scope.startApp = function() { 
		
		$scope.getSims();
		$scope.getSimulationRequests();
	};

	$scope.changeMapMode = function(mode)
	{
		if(mode != $scope.currentMapSetting)
		{
			$scope.currentMapSetting = mode;
		}
	};

	$scope.startApp();
}]);