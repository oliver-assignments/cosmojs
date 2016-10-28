angular.module('simulationManagerApp')
  .controller('simulationManagerController',['$scope','simulationManagerService','contextService','utilityService',
  ($scope,simulationManager,context,utility) => {
    $scope.simulationManager = simulationManager;
    $scope.context = context;
    $scope.utility = utility;

    $scope.deleteSim = (name) => {
      simulationManager.deleteSim(name, (err,data) => {
        if(err) {
          console.log(err);
        }
      });
    }

    $scope.startController = () => {
      simulationManager.getSimulationDescriptions((err,data) => {
        if(err) {
          console.log(err);
        } else {
          // simulationManager.pickRandom((err) => {
          //   if(err) {
          //     console.log(err);
          //   }
          // });
        }
      });
    };

    $scope.pickSim = (name) => {
      simulationManager.pickSim(name, (err) => {
        if(err) {
          console.log(err);
        }
      });
    };
    $scope.startController();
  }]);