angular.module('accountApp')
  .factory('accountService', ['$q', '$timeout', '$http', ($q, $timeout, $http) => {
    
    let accountService = {};

    let user = null;

    accountService.isLoggedIn = () => {
      if(user) {
        return true;
      } else {
        return false;
      }
    };

    accountService.getUserStatus = () => {
      return $http.get('/account/status')
      .success((data) => {
        if(data.status) {
          user = true;
        } else {
          user = false;
        }
      })
      .error((data) => {
        user = false;
      });
    };

    accountService.login = (username, password) => {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    };

    accountService.logout = () => {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    };
    accountService.register = (username, password) => {
      let deferred = $q.defer();

      $http.post('/account/signup' { username:username, password: password})
      .success((data, status) => {
        if(status===200 && data.status) {
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      .error((data) => {
        deferred.reject();
      });
      
      return deferred.promise;
    };

    return accountService;
  }]);