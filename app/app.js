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
  //,'angular-animate'
  //,'angular-bootstrap-npm'
  //,'angular-cookies'
]);
