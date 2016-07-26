var express = require('express');
var favicon = require('serve-favicon');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true})); 

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/none.ico'));

app.get('/', function(req,res)
{
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

var cosmo = require('./scripts/cosmo/index.js');
//var cosmo = require('cosmo');

//  Routes
 require('./scripts/requestRoutes')(app,cosmo);
require('./scripts/managementRoutes')(app,cosmo);
require('./scripts/renderRoutes')(app,cosmo);
require('./scripts/utilityRoutes')(app,cosmo);

var port = Number(process.env.PORT || 3000);
app.listen(port);

console.log("Listening on port " + port);
