angular.module('pageApp', ['ngAnimate'])

.factory('pageService',['contextService','simulationRendererService',
function(context,renderer)
{
	var service = {};
	service.pages = 
	[
		{name:"Home", url:"partials/partial-home.html"}
		,{name:"New", url:"partials/partial-new.html"}
		,{name:"About", url:"partials/partial-about.html"}
	];
	service.page = service.pages[0];

	service.changePage = function(name,res)
	{
		for(var p = 0 ; p < service.pages.length; p++)
		{
			if(service.pages[p].name == name)
			{
				service.page = service.pages[p];
				if(name == "Home")
				{
					renderer.renderWorldAtDateWithMode(
						{
							name:context.name
							,mode:context.mode
							,year:context.year
							,month:context.month
							,day:context.day
						},
						function(err,data)
						{
							if(err)
							{
								res(err);
							}
							else{res(null);}
						});
				}
			}
		}
		res("Cannot find page named " + name + ".");
	};


	return service;
}])

.controller('pageController',['$scope', 'pageService',
function($scope,pageService)
{
	$scope.pager = pageService;
	$scope.empty = function(err){};

	$scope.changePage = function(name,res)
	{
		pageService.changePage(name,$scope.empty);
	}

}]);