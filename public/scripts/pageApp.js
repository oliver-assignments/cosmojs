angular.module('pageApp', ['ngAnimate'])

.factory('pageService',[
function()
{
	var service = {};
	service.pages = 
	[
		{name:"Home", url:"partials/partial-home.html"}
		,{name:"New", url:"partials/partial-new.html"}
		,{name:"About", url:"partials/partial-about.html"}
	];
	service.page = service.pages[0];

	service.changePage = function(name)
	{
		for(var p = 0 ; p < service.pages.length; p++)
		{
			if(service.pages[p].name == name)
			{
				service.page = service.pages[p];
			}
		}
	};


	return service;
}])

.controller('pageController',['$scope', 'pageService',
function($scope,pageService)
{
	$scope.pager = pageService;

	$scope.changePage = function(name)
	{
		pageService.changePage(name);
	}

}]);