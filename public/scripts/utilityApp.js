angular.module('utilityApp',[])
.factory('utilityService',['$http',function($http)
{
	var utility = {};

	utility.months = [
		"January", "February", "March", "April",
		"May", "June", "July", "August", 
		"September", "October","November","December"
		];
	utility.days = [
		"Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
		"Saturday", "Sunday",
		"Arlsday", "Farsday", "Shorsday"
	];
	
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