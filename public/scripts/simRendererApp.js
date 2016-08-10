angular.module('simulationRendererApp', [])
.factory('simulationRendererService',['$http','contextService',
function($http,context)
{
	var renderer = {};

	renderer.modeSections = [
		  {name:"Flora Stats", 	modes : ["Density","Nutrient Stores", "Nutro Stores", "Nucium Stores", "Water Stores", "Growth"]}	
		, {name:"Flora DNA",    modes : ["Nutro Net","Seed Nutro Endowment", "Nucium Net", "Seed Nucium Endowment", "Number Seeds", "Thirst", "Heliophilia"]}	
		, {name:"Geography",	modes : ["Satellite", "Depth", "Elevation", "Height"]}
		, {name:"Mantle", 		modes : ["Tectonic", "Asthenosphere", "Stress"]}
		, {name:"Soil",    		modes : ["Nutrients", "Nutro", "Nucium"]}
		, {name:"Weather", 		modes : ["Sunlight", "Rainfall"]}
	];

	renderer.changeMapMode = function(req,res)
	{
		if(req != context.mapMode)
		{
			renderer.renderWorldAtDateWithMode(
				{	
					name:context.name
					,mode:req
					,days:context.days
				},
				function(err,data)
				{
					if(err)
					{
						res(err);
					}
					else
					{
						context.mode = req;
						res(null);
					}
				});
		}
	};

	renderer.renderWorldAtDateWithMode = function(req,res)
	{
		var date = "latest";
		if(req.days !=null)
		{
			date = req.days;
		}

		$http.get('/apis/worlds/' + req.name + "/" + date + "/" + req.mode)
		.success(function(renderInstructions) 
		{
			renderer.mode = req.mode;
			
			var canvas = document.getElementById("canvas");
			if(!canvas)
				return;
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
.controller('simulationRendererController',['$scope','utilityService','simulationRendererService','contextService','simulationRequestsService',
function($scope, utility, renderer, context, requester)
{
	$scope.renderer = renderer;
	$scope.utility = utility;
	$scope.context = context;

	$scope.changeMapMode = function(mode)
	{
		renderer.changeMapMode(mode,function(err,data){if(err)console.log(err);});
	};


	$scope.createSimulationRequest = function(namo,dayo)
	{
		//  Check for no simulation
		if(namo!= "No Simulation"){
			requester.createSimulationRequest({name:namo,days:dayo},function(err,data){});
		}
	};
}]);

