const express = require('express');
/*
const compression = require('compression');
const cookieParser = require('cookie-parser');
*/
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
/*
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
*/

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/cosmo';
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

/*
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};

let redisPASS;

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}
*/

const app = express();

app.use( express.static(__dirname + '/../public') );
app.use( favicon(__dirname + '/../public/images/none.ico') );
app.get('/', (req,res) => { 
	res.sendFile(path.join(__dirname + '/../public/index.html')); 
});

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: false})); 

/*
app.use(compression());

app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'cosmojs',
  resave: true,
  saveUnitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.disable('x-powered-by');
app.use(cookieParser());

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  return false;
});
*/

routes(app);

const port = Number(process.env.PORT || 3000);
app.listen(port);

console.log("Listening on port " + port);
