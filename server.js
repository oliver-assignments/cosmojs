var express = require('express');
var favicon = require('serve-favicon');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true})); 

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/none.ico'));
console.log(__dirname + '/public/images/none.ico')

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

var host = "localhost";
var port = 3000;
console.log("Listening on "+host+":" + port);
app.listen(port);