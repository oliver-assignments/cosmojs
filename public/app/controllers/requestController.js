angular.module('simulationRequestsApp')
  .controller('simulationRequestsController',['$scope','simulationRequestsService',
  ($scope,simulationRequestsService) => {
    $scope.requestManager = simulationRequestsService;

    $scope.deleteSimulationsRequests = (name) => {
      simulationRequestsService.getSimulationRequests(name, (err,data) => {
        if(err) {
          console.log(err);
        }
      });
    };

    $scope.startController = () => {
      simulationRequestsService.getSimulationRequests((err,data) => {
        if(err) {
          console.log(err);
        }
      });
    };

    $scope.createRequest = (name,days) => {
      simulationRequestsService.createSimulationRequest({name: name, days: days}, (err,data) =>  {
        if(err) {
          console.log(err);
        }
      });
    };

    $scope.processSimulationRequests = () => {
      simulationRequestsService.processSimulationRequests((err,data) => {
        if(err) {
          console.log(err);
        }
      });
    };
    $scope.startController();
  }]);
