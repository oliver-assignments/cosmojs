// 		 Render apis		//
module.exports = function(app,cosmo) 
{
	//  Return color delta file comparing what is passed to what is requested
	app.get('/apis/renderer/:worldname/:year/:month/:day',function(req,res)
	{

	});
	//  Gets the current data of a world
	app.get('/apis/worlds/:name/current/:mode', function(req,res)
	{
		cosmo.renderer.renderSimulation(
			{
				name:req.params.name,
				mode:req.params.mode
			},
			function(err,colors) {
				if(err) {
					res.send(err);return;
				}
				res.json(colors);
			});
	});

	//  Get teh world map data at a specifc date
	app.get('/apis/worlds/:name/:date/:mode', function(req,res)
	{
		cosmo.renderer.renderSimulation(
			{
				name:req.params.name,
				date:req.params.date,
				mode:req.params.mode
			},
			function(err,colors) {
				if(err) {
					res.send(err);return;
				}
				res.json(colors);
			});
	});
};