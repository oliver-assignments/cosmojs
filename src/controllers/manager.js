const World = require('../models').World;
const Snapshot = require('../models').Snapshot;
// const soilScape = require('soil-scape');

module.exports.createSimulation = function (req, res) {
  if (!req.body.name ||
      !req.body.size ||
      !req.body.plantsPer) {
    return res
      .status(400)
      .json({ error: 'Name, rows, columns, and plant plos per province are all required' });
  }
  const worldData = {
    name: req.body.name,
    rows: req.body.size.rows,
    columns: req.body.size.columns,
    plotsPer: req.body.plantsPer,
    owner: req.user._doc._id,
  };
  
  // const worldData = soilScape.createSimulation(req);

  const newWorld = new World.WorldModel(worldData);

  return newWorld.save((worldSaveErr) => {
    if (worldSaveErr) {
      return res.status(400).json(worldSaveErr);
    }

    //  Create the first day
    const snapshotData = {
      day: 0,
      tilt: 0.5,
      rotaion: 1,
      datasets: [],
      rules: [],
      owner: req.user._doc._id,
      world: req.body.name,
    };
    const newSnapshot = new Snapshot.SnapshotModel(snapshotData);

    return newSnapshot.save((snapshotSaveErr) => {
      if (snapshotSaveErr) {
        //  Delete simulation ^
        return res.status(400).json(snapshotSaveErr);
      }
      return module.exports.getSimulationDescriptions(req, res);
    });
  });
};

module.exports.deleteSimulation = function (req, res) {
  if(!req.params.name) {
    return res.status(400).json({error: "No world name specified for delete."});
  }
  return World.WorldModel.remove({name: req.params.name, owner: req.user._doc._id}, 
    (err, doc) => {
    
    if(err) {
      return res.status(500).json(err);
    }

    //  Delete associated snapshots
    return Snapshot.SnapshotModel.remove({world: req.params.name, owner: req.user._doc._id}, 
      (snapshotErr, doc) => {
      
      if(snapshotErr) {
        return res.status(500).json(snapshotErr);
      }
      return module.exports.getSimulationDescriptions(req, res);
    });
  });
};
module.exports.clearSimulations = function (req, res) {
  return World.WorldModel.remove({owner: req.user._doc._id}, 
    (err, docs) => {
    
    if(err) {
      return res.status(500).json(err);
    }

//  Delete associated snapshots
    return Snapshot.SnapshotModel.remove({owner: req.user._doc._id}, 
      (snapshotErr, docs) => {
      
      if(snapshotErr) {
        return res.status(500).json(snapshotErr);
      }

      return module.exports.getSimulationDescriptions(req, res);
      });
  });
};

module.exports.getSimulationDescriptions = function (req, res) {
  World.WorldModel.findByOwner(req.user._doc._id, (err, docs) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(docs);
  });
  // const descriptions = [];
  // for (let i = 0; i < simulations.length; i += 1) {
  //   descriptions.push(
  //     {
  //       name: simulations[i].name,
  //       days: simulations[i].dates[simulations[i].dates.length - 1].days,
  //       rules: simulations[i].dates[simulations[i].dates.length - 1].rules,
  //     });
  // }
};

module.exports.getSimulation = function (req, res) {
  // for (let s = 0; s < simulations.length; s += 1) {
  //   // console.log(simulations[s].name + " equals " + req + "?");
  //   if (simulations[s].name === req) {
  //     res(null, simulations[s]);
  //     return;
  //   }
  // }
  // res.status(404).send(`Cannot find simulation named ${req}.`);
  res.status(501).send('Not implemented.');
};

module.exports.getSimulationContext = function (req, res) {
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
  res.status(501).send('Not implemented.');
};

module.exports.getSimulationTimeline = function (req, res) {
  Snapshot.SnapshotModel.findByWorldNameAndOwner(req.params.name, req.user._doc._id, (err, docs) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(docs);
  });
};

module.exports.getSimulationDescription = function (req, res) {
  // exports.getSimulation(req, (err, simulation) => {
  //   if (err) {
  //     res(err);
  //     return;
  //   }
  //   res(null, {
  //     name: simulation.name,
  //     days: simulation.dates[simulation.dates.length - 1].days,
  //     rules: simulation.dates[simulation.dates.length - 1].rules,
  //   });
  // });
  res.status(501).send('Not implemented.');
};
