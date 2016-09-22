var express = require('express');
var enrouten = require('express-enrouten');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser')

var app = express();

app.use( express.static(__dirname + '/public') );
app.use( favicon(__dirname + '/public/images/none.ico') );
app.get('/', function(req,res) { res.sendFile(path.join(__dirname + '/public/index.html')); });

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: false})); 

app.use( enrouten({ directory: 'routes' }) );

var port = Number(process.env.PORT || 3000);
app.listen(port);

console.log("Listening on port " + port);
