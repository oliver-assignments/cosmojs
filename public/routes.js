angular.module('cosmoApp')
.config(['$routeProvider',
function($routeProvider) {
  	$routeProvider.when('/', {
    	templateUrl: 'partials/partial-home.html'
    })
}])