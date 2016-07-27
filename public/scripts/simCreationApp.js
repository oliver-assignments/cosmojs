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
		 name: ""
		, rotation: 1
		, tilt: 0.75
		, size: "small"
		, plantsPer: 9

		, rules: {
			water: false
			, maturity: false
			, disease: false
			, consumption: false
		 	, mutation: 0.999
			, roots: 8
		}
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

		//  Radio rules
		for( var r = 0 ; r < rulesService.radios.length ; r++ )
		{
			$cookies.put(
				'cosmo-' + rulesService.radios[r].variable, 
				$scope.formData[rulesService.radios[r].variable]);
		}

		//  Boolean rules
		for( var b = 0 ; b < rulesService.booleans.length ; b++ )
		{
			$cookies.put(
				'cosmo-' + rulesService.booleans[b].variable, 
				$scope.formData.rules[rulesService.booleans[b].variable]);
		}

		//  Input rules
		for( var i = 0 ; i < rulesService.fields.length ; i++ )
		{
			$cookies.put(
				'cosmo-' + rulesService.fields[i].variable, 
				$scope.formData.rules[rulesService.fields[i].variable]);
		}

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
		$scope.randomizeName();

		//  Radio rules
		for( var r = 0 ; r < rulesService.radios.length ; r++ )
		{
			var radio = $cookies.get('cosmo-' + rulesService.radios[r].variable);
			if(radio) 
			{	
				if(rulesService.radios[r].type == "number")
					radio = Number(radio);
				$scope.formData[rulesService.radios[r].variable] = radio;
			}
		}

		//  Boolean rules
		for( var b = 0 ; b < rulesService.booleans.length ; b++ )
		{
			var boolean = $cookies.get('cosmo-' + rulesService.booleans[b].variable);
			if(boolean){
				$scope.formData.rules[rulesService.booleans[b].variable] = boolean === true;
			}
		}

		//  Input rules
		for( var i = 0 ; i < rulesService.fields.length ; i++ )
		{
			var input = $cookies.get('cosmo-' + rulesService.fields[i].variable);
			if(input){
				if(rulesService.fields[i].input.type == "number")
					input = Number(input);
				$scope.formData.rules[rulesService.fields[i].variable] = input;
			}
		}
	};
	$scope.camelize = function(str) {
	  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
	    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	  }).replace(/\s+/g, '');
	};

	
	
	$scope.startApp();
}]);

