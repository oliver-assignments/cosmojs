const models = require('../models');
const Account = require('../models/account.js');
const path = require('path')

module.exports.loginPage = (req, res) => {
  res.status(200).sendFile(path.join(__dirname + '/../../public/login.html')); 
};

module.exports.login = (req,res,next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ err: info });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500);
      }
      res.status(200);
    });
  })(req, res, next);
};

module.exports.signupPage = (req, res) => {
  res.status(200).sendFile(path.join(__dirname + '/../../public/signup.html')); 
};

module.exports.signup = (req,res) => {
  Account.register(new Account({username: req.body.username}), req.body.password, (err,account) => {
      if (err) {
        return res.status(500).json({ err: err });
      }
      passport.authenticate('local')(req, res, () => {
        return res.status(200);
      });
    });
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports.isAuthenticated = (req,res) => {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
};

// module.exports.login = (req, res) => {
//   const username = `${req.body.username}`;
//   const password = `${req.body.pass}`;

//   if (!username || !password) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   return Account.AccountModel.authenticate(username, password, (err, account) => {
//     if (err || !account) {
//       return res.status(401).json({ error: 'Wrong username or password' });
//     }

//     req.session.account = Account.AccountModel.toAPI(account);

//     return res.json({ redirect: '/maker' });
//   });
// };



// module.exports.signup = (req, res) => {
//   if (!req.body.username || !req.body.pass || !req.body.pass2) {
//     return res.status(400).json({ errors: 'All fields are required.' });
//   }

//   if (req.body.pass !== req.body.pass2) {
//     return res.status(400).json({ error: 'Passwords do not match.' });
//   }

//   return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
//     const accountData = {
//       username: req.body.username,
//       salt,
//       password: hash,
//     };

//     const newAccount = new Account.AccountModel(accountData);

//     newAccount.save((err) => {
//       if (err) {
//         console.log(err);
//         return res.status(400).json({ error: 'An error occured.' });
//       }

//       req.session.account = Account.AccountModel.toAPI(newAccount);

//       return res.json({ redirect: '/maker' });
//     });
//   });
// };
