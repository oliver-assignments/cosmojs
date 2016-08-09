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
        else
        {
          $http.get('/apis/worlds/' + context.name + '/timeline')
            .success(function(data)
            {
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

  timeline.jumpToNextDate = function(direction,res)
  {
    for(var d = 0 ; d < timeline.dates.length; d++)
    {
      if(context.days == timeline.dates[d])
      {
        if(direction == -1)
        {
          if(d-1 >= 0)
          {
            timeline.pickDate(timeline.dates[d-1],res);
          }
        }
        else if(direction == 1)
        {
          if(d+1 < timeline.dates.length)
          {
            timeline.pickDate(timeline.dates[d+1],res);
          }
        }
      }
    }
  };

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

          context.days = time;
        
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
  
  $scope.start = function()
  {
    window.addEventListener(
      'keydown'
      ,function check(e) {
        var direction = 0;
        var code = e.keyCode;
          switch (code) {
            case 37: direction = -1; break; //Up key
            case 38: direction = -1; break; //Up key
            case 40: direction = 1; break; //Down key
            case 39: direction = 1; break; //Down key
            default:
          }
          if(!direction) return;

          timelineService.jumpToNextDate(direction,function(err,data) {
            if(err) console.log(err);
          });
      }
    ,false);
    
  };
  $scope.start();
}]);