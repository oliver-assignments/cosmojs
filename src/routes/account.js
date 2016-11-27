const account = require('../controllers/account.js');

module.exports = (app) => {
  app.get('/signup', account.signupPage);
  app.post('/signup', account.signup);

  app.get('/login', account.loginPage);
  app.post('/login', account.login);

  app.get('/logout', account.logout);

  app.get('/status', account.isAuthenticated)
};