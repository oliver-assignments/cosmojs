angular.module('contextApp',[])
.factory('contextService',[
function()
{
	var context = {
		name : 'No Simulation'
		,year : 1
		,month : 1
		,day : 1
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