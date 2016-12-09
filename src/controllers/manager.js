const World = require('../models').World;
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

  return newWorld.save((err) => {
    if (err) {
      console.dir(err);
      return res.status(400).json({ error: 'Cannot save new world.' });
    }
    return module.exports.getSimulationDescriptions(req, res);
  });
};

module.exports.deleteSimulation = function (req, res) {
  res.status(501).send('Not implemented.');
};
module.exports.clearSimulations = function (req, res) {
  res.status(501).send('Not implemented.');
};

module.exports.getSimulationDescriptions = function (req, res) {
  World.WorldModel.findByOwner(req.user._doc._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
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
  // exports.getSimulation(req, (err, simulation) => {
  //   if (err) {
  //     return res(err);
  //   }
  //   const dates = [];
  //   for (let d = 0; d < simulation.dates.length; d += 1) {
  //     dates.push(simulation.dates[d].days);
  //   }
  //   return res(null, dates);
  // });
  res.status(501).send('Not implemented.');
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
