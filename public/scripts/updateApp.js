angular.module("updateApp",[])
.controller('updateController',['$scope','$interval',
function($scope,$interval)
{
	$scope.every = function()
	{
		console.log("every!");
	};
	$scope.updateInt = $interval($scope.every,5000);
	

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.updateInt);
	});
}]);