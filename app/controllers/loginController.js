angular.module('accountApp')
  .controller('loginController', ['$scope', '$location','accountService', ($scope, $location, accountService) => {
      $scope.login = () => {
        $scope.error = false;
        $scope.disabled = true;

        if($scope.loginForm.username === "" || $scope.loginForm.password === "") {
          return;
        }

        accountService.login($scope.loginForm.username, $scope.loginForm.password);
        // .then(() => {
        //   // $location.path('/');
        //   $scope.disabled = false;
        //   $scope.loginForm = {};
        // })
        // .catch(() => {
        //   // $scope.error = true;
        //   $scope.errorMessage = "Invalid username and/or password.";
        //   $scope.disabled = false;
        //   $scope.loginForm = {};
        // });
      };
  }]);