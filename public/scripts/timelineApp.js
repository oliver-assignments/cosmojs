angular.module("timelineApp",[])
.filter('reverse', function() {
  return function(items) {
    return items;//.slice().reverse();
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
							// console.log(data)
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
		timeline.pickDate( timeline.dates[timeline.dates.length-1], res );
	}
	timeline.pickDate = function(time,res)
	{
		renderer.renderWorldAtDateWithMode(
			{
				name:context.name
				,days:time
				,mode:context.mode
				
			},function(err,data)
			{
				if(err)
				{
					res(err);
				}
				else
				{
					context.days = time.days;
				
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

	$scope.$on('$destroy', function() {
	    $interval.cancel($scope.playInterval);
	});
}]);