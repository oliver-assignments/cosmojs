angular.module("timelineApp",[])
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})
.factory('timelineService',['$http','contextService','simulationRendererService',
function($http,context,renderer)
{
	var timeline = {};
	
	timeline.dates = [];

	timeline.getDates = function(res)
	{
		context.getSim(function(err,picked)
			{
				if(err)
				{
					res(err);
				}
				else{
					$http.get('/apis/worlds/' + context.name + '/timeline')
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
	timeline.pickLatestDate = function(res)
	{
		timeline.pickDate(
		{
			year: timeline.dates[0].year
			,month: timeline.dates[0].month
			,day: timeline.dates[0].day
		},res);
	}
	timeline.pickDate = function(time,res)
	{
		renderer.renderWorldAtDateWithMode(
			{
				name:context.name
				,year:time.year
				,month:time.month
				,day:time.day
				,mode:context.mode
				
			},function(err,data)
			{
				if(err)
				{
					res(err);
				}
				else
				{
					context.year = time.year;
					context.month = time.month;
					context.day = time.day;
				
					res(null,data);
				}
			});
	};

	return timeline;
}])
.controller('timelineController',['$scope','$interval','timelineService','contextService',"utilityService",
function($scope,$interval,timelineService,context,utility)
{
	$scope.timelineService = timelineService;
	$scope.context = context;
	
	$scope.pickDate = function(time)
	{
		timelineService.pickDate(time,function(err,data){if(err)console.log(err);});
	};
	$scope.getTime = function()
	{
		timelineService.getDates()
	};
	$scope.parseTime=function(time)
	{
		return utility.months[time.month-1] + " " + time.day + ", Year " + time.year;
	};

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.playInterval);
	});
}]);