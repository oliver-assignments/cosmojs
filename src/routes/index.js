// const render = require('./render.js');
// const request = require('./request.js');
const manager = require('./manager.js');
const utility = require('./utility.js');

module.exports = (app) => {
	//render(app);
	//request(app);
	manager(app);
	utility(app);
};