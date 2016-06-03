angular.module('cosmoApp', 
	[
		'contextApp'
		,'simulationRequestsApp' 
		,'simulationManagerApp'
		,'simulationRendererApp'
		,'creationApp'
		,'pageApp'
		,'timelineApp'
		,'updateApp'
		,'rulesApp'
		,'utilityApp'
		,'ngAnimate'
		,'ui.bootstrap'
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