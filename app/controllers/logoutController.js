angular.module('accountApp')
  .controller('logoutController', ['$scope', '$location', 'accountService', ($scope, $location, accountService) => {
    $scope.logout = () => {
    accountService.logout()
      .then(() => {
      $location.path('/login');
      });
    };
  }]);