const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/cosmo';
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const app = express();

app.use( express.static(__dirname + '/../public') );
app.use( favicon(__dirname + '/../public/images/none.ico') );
app.get('/', (req,res) => { 
	res.sendFile(path.join(__dirname + '/../public/index.html')); 
});

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: false})); 

routes(app);

const port = Number(process.env.PORT || 3000);
app.listen(port);

console.log("Listening on port " + port);
