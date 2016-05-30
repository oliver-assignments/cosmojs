angular.module("updateApp",[])
.controller('updateController',['$scope','$interval','timelineService','simulationManagerService','pickerService',
function($scope,$interval,timeline,simManager,picker)
{
	$scope.every = function()
	{
		console.log("every!");
		simManager.getSimulationDescriptions(
			function(err,data)
			{
				if(err)
				{
					console.log(err);
				}
			});

		picker.getSim(function(err,picked)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					timeline.getDates(picked.name,function(req,res)
					{
						if(err)
						{
							console.log(err);
						}
					});
				}
			});
	};
	$scope.updateInt = $interval($scope.every,5000);
	

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.updateInt);
	});
}]);