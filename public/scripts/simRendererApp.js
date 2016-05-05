angular.module('simulationRendererApp', [])
.factory('simulationRendererService',['$http',
function($http)
{
	var renderer = {};

	renderer.mode = "Satellite";

	renderer.modeSections = [
		{name:"Geography",	modes : ["Satellite", "Depth", "Elevation", "Height"]},
		{name:"Mantle", 	modes : ["Tectonic", "Asthenosphere"]},
		{name:"Weather", 	modes : ["Sunlight", "Rainfall"]},
		{name:"Soil",    	modes : ["Nutrients", "Nutro", "Nucium"]},
		{name:"Flora",   	modes : ["Nutrient Stores", "Nutro Stores", "Nucium Stores", "Water Stores"]}
	];

	// renderer.updateColors = function(req,res)
	// {
	// 	var width = renderer.canvas.width / req.pickedSim.columns;
	// 	var height = renderer.canvas.height / req.pickedSim.rows;

	// 	$http.get('/apis/worlds/'+req.pickedSim.name+'/current/'+mode)
	// 	.success(function(data) 
	// 	{
	// 		for(var x = 0 ; x < req.pickedSim.columns; x++)
	// 		{
	// 			for(var y = 0 ; y < req.pickedSim.rows; y++)
	// 			{
	// 				var z = (y * req.pickedSim.columns)+x;
	// 				ctx.save();
	// 				ctx.fillStyle =data[z];

	// 				ctx.fillRect(
	// 					width*x,
	// 					height*y,
	// 					width+1,
	// 					height+1);

	// 				ctx.restore();

	// 			}
	// 		}	
	// 		res(null,data)
	// 	})
	// 	.error(function(data) {
	// 		res("Error updating colors: " + data);
	// 	});	
	// };

	// renderer.clearCanvas = function(req,res)
	// {
	// 	req.ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 	res(null)
	// };
	return renderer;
}])
.controller('simulationRendererController',['$scope','simulationRendererService','pickerService','simulationRequestsService','utilityService',
function($scope,simulationRendererService, picker, requester, utility)
{
	//renderer.canvas = document.getElementById("canvas");
	//renderer.ctx = renderer.canvas.getContext("2d");

	$scope.renderer = simulationRendererService;
	$scope.picker = picker;

	$scope.months = utility.months;
	$scope.days = utility.days;

	$scope.changeMapMode = function(mode)
	{
		if(mode != $scope.mapMode)
		{
			$scope.mapMode = mode;
			simulationRendererService.updateColors($scope.pickedSim.name,$scope.mapMode);
		}
	};
	$scope.createSimulationRequest = function(namo,dayo)
	{
		//  Check for no simulation
		if(namo!= "No Simulation"){
			requester.createSimulationRequest({name:namo,days:dayo},function(err,data){});
		}
	};
}]);

