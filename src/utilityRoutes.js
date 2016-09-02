'use strict';
module.exports = function(app,cosmo) 
{
  //  Utility
  app.get('/apis/utility/name/generate',function(req,res)
  {
    res.send(cosmo.utility.generateName(cosmo.utility.randomNumberBetween(5,8)));
  });
}