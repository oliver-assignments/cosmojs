'use strict';
var soil = require('../../soil-scape/index.js');
module.exports = function(app) 
{
  //  Utility
  app.get('/name/generate',function(req,res)
  {
    res.send(soil.generateName(soil.randomNumberBetween(5,8)));
  });
}