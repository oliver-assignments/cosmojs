const path = require('path');
// const render = require('./render.js');
// const request = require('./request.js');
const manager = require('./manager.js');
const utility = require('./utility.js');
const account = require('./account.js');


module.exports = (app) => {
  app.get('/', (req, res) => { 
    res.status(200).sendFile(path.join(__dirname + '/../public/index.html')); 
  });

  account(app);
  manager(app);
  utility(app);
  //render(app);
  //request(app);
};