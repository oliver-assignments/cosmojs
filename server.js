var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

var cosmo = require('cosmo');

//  Routes
require('./simulationRequestRoutes')(app,cosmo);
require('./simulationManagementRoutes')(app);
require('./simulationRenderRoutes')(app);
require('./utilityRoutes')(app);

app.listen(3000);


