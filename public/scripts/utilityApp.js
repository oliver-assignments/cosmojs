angular.module('utilityApp',[])
.filter('daysToDate', function() {
	return function(days) {
		var months = [
			"January", "February", "March", "April",
			"May", "June", "July", "August", 
			"September", "October","November","December"
			];
		var daysOfWeek = [
			"Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
			"Saturday", "Sunday",
			"Arlsday", "Farsday", "Shorsday"
		];

		var weekday = daysOfWeek[days % 10];
		var day = ((days % 360) % 30) + 1;
		var month = months[Math.floor((days % 360) / 30)];
		var year = Math.floor(days / 360) + 1;
		
		return weekday + ", " + month + " " + day + ", " + " Year " + year;
	};
})
.filter('duration', function() {
	return function(days) {
		var years = Math.floor(days / 360);
		days = days % 360;
		
		var months = Math.floor(days / 30);
		days = days % 30

		if(years == 0 && months == 0 && days == 0)
		{
			return "0 days";
		}

		return (years!=0 ? years + (years==1 ? " year" : " years") : "")  
			+ (years!=0 && months!=0 && days!=0 ? ", " : (years!=0 && months!=0 ? " and ": "")) // List commo and and
			+ (months!=0 ? months + (months==1 ? " month" : " months") : "") 
			+ (years!=0 && months!=0 && days!=0 ? ", and " : (days!=0 && (years!=0 || months!=0) ? " and ": "")) // List commo and and
			+ (days!=0 ? days + (days==1 ? " day" : " days") : "");	
	};
})
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