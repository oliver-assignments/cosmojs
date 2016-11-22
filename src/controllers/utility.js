const soil = require('soil-scape');

module.exports.generateName = (req, res) => {
	res.status(200).send(soil.generateName(soil.randomNumberBetween(5, 8)));	
};