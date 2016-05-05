angular.module("timelineApp",[])
.factory('timelineService',['pickerService',
function(picker)
{
	var timeline = {};
	timeline.playing = false;

	timeline.dates = [];

	timeline.togglePlay = function()
	{
		timeline.playing = !timeline.playing;
	};
	timeline.play = function()
	{
		timeline.playing = true;
	}
	timeline.stop = function()
	{
		timeline.playing = false;
	}
	return timeline;
}])
.controller('timelineController',['$scope','$interval','timelineService','pickerService',
function($scope,$interval,timeline,picker)
{
	$scope.timeline = timeline;
	
	$scope.pullNewestMap = function()
	{
		console.log("playing!");
	};
	$scope.playInterval;

	$scope.$watch('timeline.playing',
		function()
		{
			if(timeline.playing == true)
			{
				$interval.cancel($scope.playInterval);
				$scope.playInterval = $interval($scope.pullNewestMap,1000);
			}
			else
			{
				$interval.cancel($scope.playInterval);
			}
		});

	$scope.togglePlay = function()
	{
		timeline.togglePlay();
	};
	$scope.pickDate = function()
	{
		
	};

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.playInterval);
	});
}]);