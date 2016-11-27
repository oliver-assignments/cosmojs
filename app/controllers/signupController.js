angular.module('accountApp')
  .controller('signupController', ['$scope', '$location','accountService', ($scope, $location, accountService) => {
      $scope.signup = () => {
        $scope.error = false;
        $scope.disabled = true;

        accountService.signup($scope.signupForm.username, $scope.signupForm.password)
        .then(()=>{
          $location.path('/login');
          $scope.disabled = false;
          $scope.signupForm = {};
        })
        .catch(()=>{
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password(s).";
          $scope.disabled = false;
          $scope.signupForm = {};
        });
      };
  }]);