const utility = require('../controllers/utility.js');

module.exports = (app) => {
  app.get('/utility/name/generate', utility.generateName);
};
