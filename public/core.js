var simulationRenderer = angular.module('simulationRendererApp',[]).
	controller('simulationRendererController',['$http',function($http)
	{
		$scope.updateColors = function(name,mode)
		{
			var width = (canvas.width) / $scope.pickedSim.columns;
			var height = canvas.height /$scope.pickedSim.rows;

			$http.get('/apis/worlds/'+name+'/current/'+mode)
			.success(function(data) 
			{
				for(var x = 0 ; x < $scope.pickedSim.columns;x++)
				{
					for(var y = 0 ; y < $scope.pickedSim.rows;y++)
					{
						var z = (y*$scope.pickedSim.columns)+x;
						$scope.canvasCtx.save();
						$scope.canvasCtx.fillStyle =data[z];

						$scope.canvasCtx.fillRect(
							width*x,
							height*y,
							width+1,
							height+1);

						$scope.canvasCtx.restore();

					}
				}	
				
			})
			.error(function(data) {
				console.log("Error updating colors: " + data);
			});

			
		};
		$scope.clearColors = function()
		{
			$scope.canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
		};

	}]);

var simulationManager = angular.module('simulationManagerApp',[])
	.factory('simulationManager', ['$http',
	function($http)
	{
		var manager = {};
		manager.simulations = [];
		manager.months = [
			"January", "February", "March", "April",
			"May", "June", "July", "August", 
			"September", "October","November","December"
			];
		return manager;
	}]);


angular.module('cosmoApp', ["simulationRequestsApp", 'ngAnimate', 'ui.bootstrap'])
.controller('WorldController', ['$scope',"$http", function($scope,$http)
{
	$scope.formData = {};
	$scope.requestData = {};

	$scope.canvas = document.getElementById("canvas");
	$scope.canvasCtx = canvas.getContext("2d");

	$scope.modes = [
		{name:"Geography",     modes : ["Depth","Elevation","Height","Tectonic","Satellite"]},
		{name:"Weather", modes : ["Sunlight", "Rainfall"]},
		{name:"Soil",    modes : ["Nutro", "Nucium", "Nutrients"]},
		{name:"Flora",   modes : ["Nutro Stores", "Nucium Stores", "Water Stores", "Nutrient Stores"]}
	];

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
	$scope.currentMapSetting = "Satellite";//$scope.modes[0].modes[0];
	$scope.playing = false;

	

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
			$scope.updateColors($scope.pickedSim.name,$scope.currentMapSetting);
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
		$scope.currentMapSetting = "Satellite";
		$scope.clearColors();
	};
	
	$scope.getSims = function()
	{
		$http.get('/apis/worlds/package')
			.success(function(data){
				var pick = false;
				if(!$scope.sims || $scope.sims.length == 0)
				{
					pick = true;
				}
				$scope.sims = data;

				if(pick)
				{
					$scope.pickSimIndex(
						Math.floor((Math.random() * ($scope.sims.length))));
				}
				$scope.updateCurrent();
			})
			.error(function(data)
			{
				console.log('Cannot find simulations. ' +data);
			});
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

	$scope.createSim = function()
	{
		$http.post('/apis/worlds', $scope.formData)
			.success(function(data) {

				$scope.fillNameBlank();
				$scope.sims = data;
				$scope.pickSim($scope.formData.name);
				$scope.formData = {};
			})
			.error(function(data)
			{
				console.log('Create sim error: ' + data);
			});
	};
	$scope.deleteSim = function(name) 
	{
		//console.log("Attempting to delete " + id);
		
		$scope.deleteSimulationsRequests(name);

		$http.delete('/apis/worlds/' + name)
			.success(function(data)
			{
				$scope.sims = data;

				if(name == $scope.pickedSim.name)
				{
					$scope.pickSimIndex(0);	
				}
			})	
			.error(function(data)
			{
				console.log('Delete sim error: ' + data);
			
			});		
	};

	$scope.clearSims = function()
	{
		//console.log('Attempting to delete all sims.');

		$http.delete('/apis/worlds/')
			.success(function(data)
			{
				$scope.sims = data;
				$scope.clearPickedSim();
			})	
			.error(function(data)
			{
				console.log('Delete sim error: ' + data);
			
			});	
	};

	$scope.startApp = function() { 
		
		$scope.getSims();
		$scope.getSimulationRequests();
		$scope.fillNameBlank();
		//$scope.createSim();
	};

	$scope.changeMapMode = function(mode)
	{
		if(mode != $scope.currentMapSetting)
		{
			$scope.currentMapSetting = mode;
			$scope.updateColors($scope.pickedSim.name,$scope.currentMapSetting);
		}
	};

	$scope.fillNameBlank = function()
	{
		$http.get('/apis/utility/name/generate')
			.success(function(data)
			{
				$scope.formData.name = data;
			})	
			.error(function(data)
			{
				console.log('Generate name error: ' + data);
			
			});	
	};

	$scope.startApp();
}]);