const manager = require('./manager.js');
const colorize = require('./colorize.js');
const createColorArray = require('./colorize.js');

module.exports.renderSimulationWithIdandMode = (req, res) => {
	console.log("render this!");
  Snapshot.SnapshotModel.findById(req.params.id,
   "plotsPer rows columns datasets",
   (err, doc) => {
    if (err) {
      return res.status(400).json(err);
    }

    //  Return colorized mode data using doc and mode
		//  Colorize will use the doc's .dataset and size data
		
  });
};
module.exports.renderSimulationWithNameDayAndMode = (req, res) => {
	Snapshot.SnapshotModel.findByNameDayAndOwner(req.params.name,
		req.params.day,
		req.user._doc._id,
		"plotsPer rows columns datasets",
		(err, doc) => {
			if(err) {
				return res.status(400).json(err);
			}
			
			//  Return colorized mode data using doc and mode
			//  Colorize will use the doc's .dataset and size data

		});
}