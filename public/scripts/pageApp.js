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
	service.url = service.pages[0].url;

	service.changePageURL = function(url)
	{
		return (service.url = url);
	};
	service.changePage = function(name)
	{
		for(var p = 0 ; p < service.pages.length; p++)
		{
			if(service.pages[p].name == name)
			{
				service.changePageURL(service.pages[p].url);
				return service.url;
			}
		}
	};


	return service;
}])

.controller('pageController',['$scope', 'pageService',
function($scope,pageService)
{
	$scope.pages = pageService.pages;
	$scope.url = pageService.url;

	$scope.changePage = function(name)
	{
		$scope.url = pageService.changePage(name);
	}

}]);