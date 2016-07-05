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
			 	function(err,renderInstructions) {
					if(err) {
						res.status = (err.status || 500);
						res.render('error', {
					        message: err,
					        error: err
					    });
					}
					else {
						res.json(renderInstructions);
					}
				});
		});

	//  Get teh world map data at a specifc date
	app.get('/apis/worlds/:name/:days/:mode', 
		function(req,res)
		{
			cosmo.renderer.renderSimulationContextWithMode(
				{
					name:req.params.name
					,mode:req.params.mode
					,days:req.params.days
				},
				function(err,renderInstructions) {
					if(err) {
						res.status = (err.status || 500);
						res.render('error', {
					        message: err,
					        error: err
					    });
					}
					else {
						res.json(renderInstructions);
					}
				});
		});
};