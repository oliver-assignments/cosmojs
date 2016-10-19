angular.module('utilityApp')
  .factory('utilityService',['$http', ($http) => {
    var utility = {};

    utility.getRandomName = (res) => {
      $http.get('/utility/name/generate')
        .success((data) => {       
          res(null,data);
        })  
        .error((data) => {
          res('Generate name error: ' + data);
        }); 
    };
    return utility;
  }]);