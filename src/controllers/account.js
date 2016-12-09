const passport = require('passport');
const Account = require('../models/account.js');
const path = require('path');

module.exports.loginPage = (req, res) => {
  res.status(200).sendFile(path.join(`${__dirname}/../html/login.html`));
};

module.exports.login = (req, res, next) => {
  passport.authenticate('local', (err, account, info) => {
    if (err) {
      return next(err);
    }
    if (!account) {
      return res.status(401).json({ err: info });
    }
    return req.logIn(account, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ err: loginErr });
      }
      return res.status(200).json({ status: 'Logged in.' });
    });
  })(req, res, next);
};

module.exports.signupPage = (req, res) => {
  res.status(200).sendFile(path.join(`${__dirname}/../html/signup.html`));
};

module.exports.signup = (req, res) => {
  const acct = new Account({ username: req.body.username });
  return Account.register(acct, req.body.password, (err) => {
    if (err) {
      return res.status(500).json({ err });
    }
    return passport.authenticate('local')(req, res, () => res.status(200).json({ status: 'Registered.' }));
  });
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
