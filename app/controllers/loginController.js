angular.module('accountApp')
  .controller('loginController', ['$scope', '$location','$window','accountService', ($scope, $location,$window,accountService) => {
      $scope.login = () => {
        $scope.error = false;
        $scope.disabled = true;

        if(!$scope.loginForm.username ||
          !$scope.loginForm.password ||
          $scope.loginForm.username === "" || 
          $scope.loginForm.password === ""
          ) {
          $scope.error = true;
          $scope.errorMessage = "All fields are required.";
          return;
        }

        accountService.login($scope.loginForm.username, $scope.loginForm.password)
        .then(() => {
          $scope.disabled = false;
          $scope.loginForm = {};
          $window.location.href = "/";
        })
        .catch(() => {
          console.log("Invalid username and/or password.");
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password.";
          $scope.disabled = false;
          $scope.loginForm.password = "";
        });
      };
  }]);