angular.module('cosmoApp', 
	[
		'simulationRequestsApp', 
		'simulationManagerApp',
		'simulationRendererApp',
		'utilityApp',
		'ngAnimate', 
		'ui.bootstrap'
	])
.controller('cosmoAppController', ['$scope',
function($scope)
{
	$scope.startApp = function() { 
		
		// $scope.getSims();
		// $scope.getSimulationRequests();
	};
	$scope.startApp();
}]);