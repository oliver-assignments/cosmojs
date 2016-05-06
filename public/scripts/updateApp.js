angular.module("updateApp",[])
.controller('updateController',['$scope','$interval','simulationManagerService','pickerService',
function($scope,$interval,simManager,picker)
{
	$scope.every = function()
	{
		console.log("every!");
		simManager.getSims(
			function(err,data)
			{
				if(err)
				{
					console.log(err);
				}
			});
		
	};
	$scope.updateInt = $interval($scope.every,5000);
	

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.updateInt);
	});
}]);