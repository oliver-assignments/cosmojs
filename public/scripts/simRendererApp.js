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

	renderer.renderWorldAtDateWithMode = function(req,res)
	{
		if(req.mode == undefined) {req.mode = renderer.mode;}

		var date = "latest";
		if(req.year !=null)
		{
			date = req.year + "/" + req.month + "/" + req.day;
		}

		console.log("Renderering " + req.name);

		$http.get('/apis/worlds/' + req.name + "/" + date + "/" + req.mode)
		.success(function(renderInstructions) 
		{
			renderer.mode = req.mode;
			
			var canvas = document.getElementById("canvas");
			var ctx = canvas.getContext("2d");

			var width = canvas.width / renderInstructions.columns;
			var height = canvas.height / renderInstructions.rows;

			for(var x = 0 ; x < renderInstructions.columns; x++)
			{
				for(var y = 0 ; y < renderInstructions.rows; y++)
				{
					var z = (y * renderInstructions.columns)+x;
					ctx.save();
					ctx.fillStyle = renderInstructions.colors[z];

					ctx.fillRect(
						width*x,
						height*y,
						width+1,
						height+1);

					ctx.restore();
				}
			}	

			res(null,renderInstructions)
		})
		.error(function(err) {
			res("Error updating colors: " + err);
		});	
	};
	
	return renderer;
}])
.controller('simulationRendererController',['$scope','simulationRendererService','pickerService','simulationRequestsService',
function($scope, renderer, picker, requester)
{
	$scope.renderer = renderer;

	$scope.picker = picker;

	$scope.changeMapMode = function(mode)
	{
		if(mode != renderer.mapMode)
		{
			renderer.renderWorldAtDateWithMode(
				{	
					name:picker.name
					,mode:mode
					,year:picker.year
					,month:picker.month
					,day:picker.day
				},
				function(err,data)
				{
					if(err)
					{
						console.log(err);
					}
				});
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

