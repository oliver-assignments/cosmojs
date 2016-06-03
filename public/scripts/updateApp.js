angular.module("updateApp",[])
.controller('updateController',['$scope','$interval','timelineService','simulationManagerService','simulationRequestsService',
function($scope,$interval,timeline,manager,requests)
{
	$scope.every = function()
	{
		//console.log("Update.");
		manager.getSimulationDescriptions(function(err,data){if(err){console.log(err);}});

		timeline.getDates(function(err,data){if(err){console.log(err);}});

		requests.getSimulationRequests(function(err,data){if(err){console.log(err);}});
	};
	$scope.updateInt = $interval($scope.every,5000);
	

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.updateInt);
	});
}]);