angular.module('creationApp',['ngCookies'])
.factory('creationService',['rulesService','simulationManagerService','simulationRendererService','pageService','contextService',
function(rulesService,simulationManagerService,renderer,page,context)
{
	var creationService = {};

	creationService.createSim = function(formData,res)
	{
		simulationManagerService.createSim(formData,function(err,data)
		{
			if(err)
			{
				res(err);
			}
			else
			{
				res(null);
			}
		});
	};
	creationService.navigateToSim = function (name)
	{
		simulationManagerService.pickSim(name,function(err)
			{
				if(err)
				{
					console.log(err)
				}
				else
				{
					renderer.renderWorldAtDateWithMode(
						{	
							name:context.name
							,days:context.days
						},
						function(err,data)
						{
							if(err)
							{
								console.log(err);
							}
							else
							{
								page.changePage("Home",
									function(err)
									{
										if(err)
											console.log(err);
									});

							}
						});

					simulationManagerService.getSimulationDescriptions(function(err,data)
					{
						if(err)
						{
							console.log(err);
						}
					})
					
				}
			});
	}
	return creationService;

}])
.controller('creationController', ['$scope','$cookies','rulesService','creationService','utilityService',
function($scope,$cookies, rulesService,creationService,utility) 
{
	$scope.rules = rulesService;

	$scope.formData={
		 name: 		""
		, rotation: 1
		, tilt: 	0.75
		, size: 	"small"
		, plotsPer: 9
	};
	$scope.isValidNumber = function(n)
	{
		return n != null &&
			n != "" && !isNaN(n);
	};
	$scope.createSim = function()
	{
		for (var i in $scope.formData) 
		{
		    if ($scope.formData[i] === null ||
		    	$scope.formData[i] === "" || 
		    	$scope.formData[i] === undefined || 
		    	$scope.formData[i] === false) 
		    {
		        delete $scope.formData[i];
		    }
		}

		$cookies.put('cosmo-tilt', "" + $scope.formData.tilt);
		$cookies.put('cosmo-rotation', "" + $scope.formData.rotation);
		$cookies.put('cosmo-plots-per', "" + $scope.formData.plotsPer);
		$cookies.put('cosmo-size', $scope.formData.size);

		creationService.createSim($scope.formData,
			function(err)
			{
				if(err)
				{
					alert(err);
				}
				else
				{
					creationService.navigateToSim($scope.formData.name);
				}
			});

	};

	$scope.randomizeName = function()
	{
		utility.getRandomName(function(err,data)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					$scope.formData.name = data;
				}
			});
	};
	$scope.startApp = function()
	{
		$scope.randomizeName();//80x100

		var size = $cookies.get('cosmo-size');
		if(size){
			$scope.formData.size = size;
		}
		var rotation = $cookies.get('cosmo-rotation');
		if(rotation){
			$scope.formData.rotation = Number(rotation);
		}
		var tilt = $cookies.get('cosmo-tilt');
		if(tilt){
			$scope.formData.tilt = Number(tilt);
		}
		var plotsPer = $cookies.get('cosmo-plots-per');
		if(plotsPer){
			$scope.formData.plotsPer = Number(plotsPer);
		}

	};
	$scope.camelize = function(str) {
	  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
	    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	  }).replace(/\s+/g, '');
	};

	
	
	$scope.startApp();
}]);

