angular.module("updateApp")
  .controller('updateController',['$scope','$interval','timelineService','simulationManagerService','simulationRequestsService',
  ($scope,$interval,timeline,manager,requests) => {
    $scope.every = () => {
      manager.getSimulationDescriptions((err,data) => {
        if(err) {
          console.log(err);
        }
      });

      timeline.getDates((err,data) => {
        if(err) {
          console.log(err);
        }
      });

      requests.getSimulationRequests(
        function(err,data) {
          if(err) {
            console.log(err);
          }
        });
    };
    //$scope.updateInt = $interval($scope.every,5000);
    
    $scope.$on('$destroy', () => {
        $interval.cancel($scope.updateInt);
    });
  }]);