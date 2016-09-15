var express = require('express');
var favicon = require('serve-favicon');
var assert = require('assert');

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

var cosmo = require('./src/soil-scape/index.js');

//  Routes
require('./src/requestRoutes')(app,cosmo);
require('./src/managementRoutes')(app,cosmo);
require('./src/renderRoutes')(app,cosmo);
require('./src/utilityRoutes')(app,cosmo);

var port = Number(process.env.PORT || 3000);
app.listen(port);

console.log("Listening on port " + port);
