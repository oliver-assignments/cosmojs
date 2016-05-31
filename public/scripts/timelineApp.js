angular.module("timelineApp",[])
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})
.factory('timelineService',['$http','pickerService',
function($http,picker)
{
	var timeline = {};
	timeline.playing = false;

	timeline.dates = [];

	timeline.getDates = function(name,res)
	{
		picker.getSim(function(err,picked)
			{
				if(err)
				{
					console.log(err);
				}
				else{
					$http.get('/apis/worlds/' + picked.name + '/timeline')
						.success(function(data){
							timeline.dates = data;
							res(null,data);
						})
						.error(function(data)
						{
							res('Get simulation requests error: ' + data);
						});
				}
			});
	};

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
.controller('timelineController',['$scope','$interval','timelineService','pickerService','simulationRendererService',"utilityService",
function($scope,$interval,timelineService,picker,renderer,utility)
{
	$scope.timelineService = timelineService;
	$scope.picker = picker;
	
	$scope.pullNewestMap = function()
	{
		console.log("playing!");

		picker.pickSim(name, 
			function(err)
			{
				if(err){
					timelineService.playing = false;
					picker.pickRandom(function(err)
						{
							if(err)console.log(err);
						});
				}
				else
				{
					renderer.updateColors(
						{	
							name:picker.pickedSim.name
							,year:picker.pickedSim.year
							,month:picker.pickedSim.month
							,day:picker.pickedSim.day
						},
						function(err,data)
						{
							if(err)console.log(err);
						});
				}
			});
	};
	$scope.playInterval;

	$scope.$watch('timelineService.playing',
		function()
		{
			if(timelineService.playing == true)
			{
				$interval.cancel($scope.playInterval);
				$scope.playInterval = $interval($scope.pullNewestMap,1000);
			}
			else
			{
				$interval.cancel($scope.playInterval);
			}
		});

	$scope.$watch('picker.pickedSim.name',
		function()
		{
			timelineService.playing = false;
			picker.getSim(function(err,picked)
			{
				if(err)
				{
					console.log(err);
				}
				else 
				{
					timelineService.getDates(picked.name,function(err,data)
					{
						if(err)
						{
							console.log(err);
						}
						else
						{
							//console.log(data);
						}
					});
				}
			});
		});

	$scope.togglePlay = function()
	{
		timelineService.togglePlay();
	};
	$scope.pickDate = function(time)
	{
	// 	console.log("Picked date: ");
	// 	console.log(time);
		
		renderer.updateColors(
			{
				name:$scope.picker.pickedSim.name
				,year:$scope.picker.pickedSim.year
				,month:$scope.picker.pickedSim.month
				,day:$scope.picker.pickedSim.day
				
			},function(err,data)
			{
				$scope.picker.pickDate(time);
			});
	};
	$scope.getTime = function()
	{
		timeline.getDates()
	};
	$scope.parseTime=function(time)
	{
		return utility.months[time.month-1] + " " + time.day + ", Year " + time.year;
	};

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.playInterval);
	});
}]);