angular.module('simulationRendererApp', [])
.factory('simulationRendererService',['$http', function($http)
{
	var renderer = {};

	renderer.months = [
		"January", "February", "March", "April",
		"May", "June", "July", "August", 
		"September", "October","November","December"
		];
	renderer.days = [
		"Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
		"Saturday", "Sunday",
		"Arlsday", "Farsday", "Shorsday"
	];
	renderer.modes = [
		{name:"Geography",	modes : ["Satellite", "Depth", "Elevation", "Height"]},
		{name:"Mantle", 	modes : ["Tectonic", "Asthenosphere"]},
		{name:"Weather", 	modes : ["Sunlight", "Rainfall"]},
		{name:"Soil",    	modes : ["Nutrients", "Nutro", "Nucium"]},
		{name:"Flora",   	modes : ["Nutrient Stores", "Nutro Stores", "Nucium Stores", "Water Stores"]}
	];

	renderer.updateColors = function(req,res)
	{
		var width = req.canvas.width / req.pickedSim.columns;
		var height = req.canvas.height / req.pickedSim.rows;

		var ctx = req.canvas.getContext("2d");

		$http.get('/apis/worlds/'+req.pickedSim.name+'/current/'+mode)
		.success(function(data) 
		{
			for(var x = 0 ; x < req.pickedSim.columns; x++)
			{
				for(var y = 0 ; y < req.pickedSim.rows; y++)
				{
					var z = (y * req.pickedSim.columns)+x;
					ctx.save();
					ctx.fillStyle =data[z];

					ctx.fillRect(
						width*x,
						height*y,
						width+1,
						height+1);

					ctx.restore();

				}
			}	
			res(null,data)
		})
		.error(function(data) {
			res("Error updating colors: " + data);
		});	
	};

	renderer.clearCanvas = function(req,res)
	{
		req.ctx.clearRect(0, 0, canvas.width, canvas.height);
		res(null)
	};
	return renderer;
}])
.controller('simulationRequestsController',['$scope','simulationRendererService',
function($scope,simulationRendererService)
{
	$scope.mapMode = "Satellite";

	$scope.canvas = document.getElementById("canvas");
	$scope.canvasCtx = canvas.getContext("2d");

	$scope.changeMapMode = function(mode)
	{
		if(mode != $scope.mapMode)
		{
			$scope.mapMode = mode;
			$scope.updateColors($scope.pickedSim.name,$scope.mapMode);
		}
	};
}]);

