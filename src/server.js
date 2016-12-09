const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const routes = require('./routes');
const Account = require('./models/account.js');

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/cosmo';
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

let redisURL = {
  hostname: 'localhost',
  port: 6379,
};

let redisPASS;

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

const app = express();

app.use(express.static(`${__dirname}/../public`));
app.use(favicon(`${__dirname}/../public/images/none.ico`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

routes(app);

const port = Number(process.env.PORT || 3000);
app.listen(port);

console.log(`Listening on port ${port}`);
