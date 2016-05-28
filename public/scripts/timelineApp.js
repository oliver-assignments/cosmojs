angular.module("timelineApp",[])
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
					renderer.updateColors(picker.pickedSim.name,
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
							console.log(data);
						}
					});
				}
			});
		});

	$scope.togglePlay = function()
	{
		timelineService.togglePlay();
	};
	$scope.pickDate = function()
	{
		//$timeline.playing = false;
		// lload the picked world
		picker.getSim(function(err,picked)
		{
			if(err)
			{
				console.log(err);
			}
			else 
			{
				
			}
		});
	};
	$scope.getTime = function()
	{
		timeline.getDates()
	};
	$scope.parseTime=function(time)
	{

		//var data = time.split(",");
		//var dayOfTheWeek = utility.days[(data[2]-1)%10] ;
		return utility.months[time.month-1] + " " + time.day + ", Year " + time.year;
	};

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.playInterval);
	});
}]);