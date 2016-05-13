'use strict';
module.exports = function(app,cosmo) 
{
	//  Utility
	app.get('/apis/utility/name/generate',function(req,res)
	{
		res.send(cosmo.generateName(cosmo.randomNumberBetween(5,8)));
	});
}