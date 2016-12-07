angular.module('accountApp')
  .controller('signupController', ['$scope', '$window','accountService', ($scope, $window, accountService) => {
      $scope.signupForm = {};
      $scope.signup = () => {
        $scope.error = false;
        $scope.disabled = true;

        if(
          !$scope.signupForm.username || 
          !$scope.signupForm.password || 
          !$scope.signupForm.retypePassword ||
          $scope.signupForm.username === "" || 
          $scope.signupForm.password === "" || 
          $scope.signupForm.retypePassword === "") {
          $scope.error = true;
          $scope.errorMessage = "All fields are required.";
          return;
        }
        if($scope.signupForm.password !== $scope.signupForm.retypePassword) {
          $scope.error = true;
          $scope.errorMessage = "Passwords do not match.";
          return;
        }

        accountService.signup($scope.signupForm.username, $scope.signupForm.password)
        .then(()=>{
          $scope.disabled = false;
          $scope.signupForm = {};
          $window.location.href = "/";
        })
        .catch(()=>{
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password(s).";
          $scope.disabled = false;
          $scope.signupForm = {};
        });
      };
  }]);