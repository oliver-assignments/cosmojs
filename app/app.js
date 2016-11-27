require('angular');
require('angular-animate');
require('angular-bootstrap-npm');
require('angular-cookies');

require('./apps');
require('./services');
require('./filters');
require('./controllers');

angular.module('cosmoApp', [
  'contextApp'
  ,'simulationRequestsApp' 
  ,'simulationManagerApp'
  ,'simulationRendererApp'
  ,'creationApp'
  ,'pageApp'
  ,'timelineApp'
  ,'updateApp'
  ,'rulesApp'
  ,'utilityApp'
  ,'ngRoute'
  ,'angular-animate'
  ,'angular-bootstrap-npm'
  ,'angular-cookies'
])
.config(($routeProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: 'index.html'
      access: {restricted: true}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      access: {restricted: false}
      //controller: 'loginController'
    })
    .when('/logout', {
      // controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/signup', {
      templateUrl: '/signup.html',
      access: {restricted: false}
    })
    .otherwise({
      redirectTo: '/'
    })
    ;
})
.run(function ($rootScope, $location, $route, accountService) {
  $rootScope.$on('$routeChangeStart',
    (event, next, current) => {
      accountService.getUserStatus()
      .then(() => {
        if (next.access.restricted && accountService.isLoggedIn() === false) {
          $location.path('/login');
          $route.reload();
        }
      });
  });
});
