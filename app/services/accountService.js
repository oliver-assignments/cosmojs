angular.module('accountApp')
  .factory('accountService', ['$q', '$timeout', '$http', ($q, $timeout, $http) => {
    
    let accountService = {};

    let account = null;
    // accountService.username = null;

    accountService.isLoggedIn = () => {
      if(account) {
        return true;
      } else {
        return false;
      }
    };

    accountService.getUserStatus = () => {
      return $http.get('/status')
      .success((data) => {
        if(data.status) {
          account = true;
        } else {
          account = false;
        }
      })
      .error((data) => {
        account = false;
      });
    };

    accountService.login = (username, password) => {

      var deferred = $q.defer();

      $http.post('/login', {username: username, password: password})
        .success(function (data, status) {
          if(status === 200 && data.status){
            console.log(data);
            account = true;
            accountService.username;
            deferred.resolve();
          } else {
            account = false;
            deferred.reject();
          }
        })
        .error(function (data) {
          account = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    };

    accountService.logout = () => {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/logout')
        // handle success
        .success(function (data) {
          account = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          account = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    };
    accountService.signup = (username, password) => {
      let deferred = $q.defer();

      $http.post('/signup', { username:username, password: password})
      .success((data, status) => {
        if(status===200 && data.status) {
          console.log("Signup");
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