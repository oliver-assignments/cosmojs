const models = require('../models');

const Account = models.Account;

module.exports.loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

module.exports.signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports.login = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

module.exports.signup = (req, res) => {
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ errors: 'All fields are required.' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    newAccount.save((err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured.' });
      }

      req.session.account = Account.AccountModel.toAPI(newAccount);

      return res.json({ redirect: '/maker' });
    });
  });
};
