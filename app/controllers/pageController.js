angular.module('pageApp')
  .controller('pageController',['$scope', 'pageService', ($scope, pageService) => {
    $scope.pager = pageService;
    $scope.empty = (err) => {};

    $scope.changePage = (name,res) => {
      pageService.changePage(name,$scope.empty);
    };
  }]);