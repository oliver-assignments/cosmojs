const account = require('../controllers/account.js');
const index = require('../controllers');
const middle = require('../middleware');

module.exports = (app) => {
  app.get('/signup', middle.requiresLogout, account.signupPage);
  app.post('/signup', middle.requiresLogout, account.signup);

  app.get('/login', middle.requiresLogout, account.loginPage);
  app.post('/login', middle.requiresLogout, account.login, index.homePage);

  app.get('/logout', middle.requiresLogin, account.logout);
};