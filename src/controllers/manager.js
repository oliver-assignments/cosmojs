const Snapshot = require('../models').Snapshot;
const soilScape = require('../../../soil-scape');

module.exports.createWorld = function (req, res) {
  if (!req.body.name ||
      !req.body.size ||
      !req.body.plantsPer ||
      !req.body.tilt ||
      !req.body.rotation) {
    return res
      .status(400)
      .json({ error: 'Name, rows, columns, plant plots per province, tilt, and rotation are all required' });
  }



  let snapshotData = {
    name: req.body.name,
    rows: 80,//req.body.size.rows,
    columns: 50,//req.body.size.columns,
    plotsPer: req.body.plantsPer,
    day: 0,
    tilt: 0.5,
    rotation: 1,
    datasets: {},
    rules: req.body.rules,
  };

  snapshotData = soilScape.createSimulation(snapshotData);
  snapshotData.owner = req.user._doc._id;

  const newSnapshot = new Snapshot.SnapshotModel(snapshotData);

  return newSnapshot.save((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    }
    //  Return descriptions of simulations if we create a new one
    return module.exports.getWorldDescriptions(req, res);
  });
};

module.exports.deleteWorld = function (req, res) {
  if (!req.params.name) {
    return res.status(400).json({ error: 'No world name specified for deletion.' });
  }
  //  Delete snapshots associated with name and account
  return Snapshot.SnapshotModel.remove({ name: req.params.name, owner: req.user._doc._id },
  (snapshotErr) => {
    if (snapshotErr) {
      return res.status(500).json(snapshotErr);
    }
    return module.exports.getWorldDescriptions(req, res);
  });
};

module.exports.clearWorlds = function (req, res) {
  //  Delete snapshots associated with my account
  return Snapshot.SnapshotModel.remove({ owner: req.user._doc._id },
  (snapshotErr) => {
    if (snapshotErr) {
      return res.status(500).json(snapshotErr);
    }
    return module.exports.getWorldDescriptions(req, res);
  });
};

module.exports.getWorldDescriptions = function (req, res) {
  
  //  Get unique by owner or just grab the oldest
  Snapshot.SnapshotModel.findUniquesByOwner(req.user._doc._id, Snapshot.descriptionData, (err, docs) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(docs);
  });
};

module.exports.getWorld = function (req, res) {

  res.status(501).send('Not implemented.');
  
  Snapshot.SnapshotModel.findById(
    req.params._id,
    Snapshot.allData,
    (err, doc) => {
      if (err) {
        return res.status(400).json(err);
      }
      return res.status(200).json(doc);
    });

  // exports.getSimulation(req.name, (err, simulation) => {
  //   if (err) {
  //     res(err);
  //     return;
  //   }

  //   if (req.days === undefined) {
  //     if (simulation.dates.length > 0) {
  //       res(null, simulation.dates[simulation.dates.length - 1]);
  //     } else {
  //       res('Cannot get simulation context of empty dates.');
  //     }
  //   } else {
  //     for (let d = simulation.dates.length - 1; d >= 0; d -= 1) {
  //       if (simulation.dates[d].days === req.days) {
  //         res(null, simulation.dates[d]);
  //         return;
  //       }
  //     }
  //     res(`Simulation named ${req.name} does not have date ${req.days}d.`);
  //   }
  // });
  // res.status(404).send(`Cannot find simulation named ${req}.`);
};

module.exports.getWorldTimeline = function (req, res) {
  Snapshot.SnapshotModel.findByNameAndOwner(
    req.params.name,
    req.user._doc._id,
    Snapshot.descriptionData,
    (err, docs) => {
      if (err) {
        return res.status(400).json(err);
      }
      return res.status(200).json(docs);
    });
};

module.exports.getWorldDescription = function (req, res) {

  Snapshot.SnapshotModel.findByNameAndOwner(
    req.params.name,
    req.user._doc._id, Snapshot.descriptionData, (err, docs) => {
    if (err) {
      return res.status(400).json(err);
    }
    res.status(200).json(docs[doc.length-1]);
  });
};
