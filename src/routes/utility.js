const soil = require('soil-scape');

module.exports = (app) => {
  app.get('utility/name/generate', (req, res) => {
    res.send(soil.generateName(soil.randomNumberBetween(5, 8)));
  });
};
