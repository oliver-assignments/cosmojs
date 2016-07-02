angular.module('contextApp',[])
.factory('contextService',[
function()
{
	var context = {
		name : 'No Simulation'
		,days : 0
		,mode: 'Satellite'
	};

	context.getSim = function(res)
	{
		if(context.name == "No Simulation")
		{
			res("Simulation hasn't been picked yet.");
		}
		else
		{
			res(null,context);
		}
	};
	return context;
}]);