'use strict';
// 		 Render apis		//
module.exports = function(app,cosmo) 
{
	//  Gets the current data of a world
	app.get('/apis/worlds/:name/latest/:mode', 
		function(req,res)
		{
			cosmo.renderer.renderSimulationContextWithMode(
				{
					name:req.params.name
					,mode:req.params.mode
				},
			 	function(err,colors) {
					if(err) {
						res.send(err);
					}
					else {
						res.json(colors);
					}
				});
		});

	//  Get teh world map data at a specifc date
	app.get('/apis/worlds/:name/:year/:month/:day/:mode', 
		function(req,res)
		{
			cosmo.renderer.renderSimulationContextWithMode(
				{
					name:req.params.name
					,mode:req.params.mode
					,year:req.params.year
					,month:req.params.month
					,day:req.params.day
				},
				function(err,colors) {
					if(err) {
						res.send(err);
					}
					else {
						res.json(colors);
					}
				});
		});
};