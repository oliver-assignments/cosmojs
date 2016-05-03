angular.module('utilityApp',[])
.factory('utilityService',['$http',function($http)
{
	var utility = {};
	utility.getRandomName = function(res)
	{
		$http.get('/apis/utility/name/generate')
			.success(function(data)
			{				
				res(null,data);
			})	
			.error(function(data)
			{
				res('Generate name error: ' + data);
			});	
	};
	return utility;
}]);