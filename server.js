var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true})); 

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res)
{
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

var cosmo = require('cosmo');

//  Routes
require('./simulationRequestRoutes')(app,cosmo);
require('./simulationManagementRoutes')(app,cosmo);
require('./simulationRenderRoutes')(app,cosmo);
require('./utilityRoutes')(app,cosmo);

var localHost = 3000;
console.log("Listening on localhost:" + localHost);
app.listen(localHost);