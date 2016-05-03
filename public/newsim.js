angular.module('newSimulationApp', 
	[
		'rulesApp',
		'simulationManagerApp',
		'utilityApp',
		'ngAnimate',
		'ui.bootstrap'
	])
.controller('newSimController', ['$window', '$scope','$http','rulesService','simulationManagerService','utilityService',
function($window,$scope,$http, rulesService, simulationManager, utility) 
{
	$scope.rules = rulesService;

	$scope.formData={
		name: "",
		metabolism: true,
		rotation: 1,
		tilt: 0.75,
		dimensions:{columns:80,rows:50},
		rules:[]
	};
	
	$scope.startApp = function()
	{
		$scope.randomizeName();
		
	};
	$scope.randomizeName = function()
	{
		utility.getRandomName(function(err,name)
		{
			if(err)
			{
				console.log(err)
			}
			else{
				$scope.formData.name = name;
			}
		});
	};
	$scope.createSim = function()
	{
		simulationManager.createSim($scope.formData,function(err,data)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{
				$window.location.href ="/";//worlds/"+$scope.formData.name;
			}
		});
	};
	$scope.startApp();
}]);

// for (var i in $scope.formData) {
	//   if ($scope.formData[i] === null ||$scope.formData[i] === "" || $scope.formData[i] === undefined || $scope.formData[i] == false) {
	//     delete $scope.formData[i];
	//   }
	// }
	// $scope.isValidNumber = function(n)
	// {
	// 	return n != null &&
	// 		n != "" && !isNaN(n);
	// };