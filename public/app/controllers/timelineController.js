angular.module("timelineApp")
  .controller('timelineController',['$scope','$interval','timelineService','contextService',"utilityService", 
    ($scope,$interval,timelineService,context,utility) => {
      $scope.timelineService = timelineService;
      $scope.context = context;
      
      $scope.pickDate = (time) => {
        timelineService.pickDate(time,function(err,data){if(err)console.log(err);});
      };
      $scope.getTime = () => {
        timelineService.getDates()
      };
      
      $scope.start = () => {
        window.addEventListener('keydown', 
          (e) => {
            var direction = 0;
            var code = e.keyCode;
              switch (code) {
                case 37: direction = -1; break; //Up key
                case 38: direction = -1; break; //Up key
                case 40: direction = 1; break; //Down key
                case 39: direction = 1; break; //Down key
                default:
              }
              if(!direction) {
                return;
              }

              timelineService.jumpToNextDate(direction, (err,data) => {
                if(err) { 
                  console.log(err);
                }
              });
          }
        ,false);
        
      };
      $scope.start();
  }]);