const soilScape = require('soil-scape');

const models = require('../models');
const World = models.World.WorldModel;


exports.createSimulation = function (req, res) {
  
  if (!req.body.name || 
      !req.body.rows || 
      !req.body.columns || 
      !req.plotsPer) {
    return res.status(400).json({ 
      error: 
      'Name, rows, columns, and plant plos per province are all required' });
  }

  const newWorld = new World(soilScape.createSimulation(req));

  return newWorld.save((err) => {
    if (err) {
      return res.json({ err });
    }

    return res.json({ name }); //  send simulations
  });

  res.status(500).send("Wow ok"); //World.);
};

exports.deleteSimulation = function (req, res) {
  res.status(501).send("Not implemented.");
};
exports.clearSimulations = function (req, res) {
  res.status(501).send("Not implemented.");
};

exports.getSimulationDescriptions = function (req, res) {
  const descriptions = [];
  // for (let i = 0; i < simulations.length; i += 1) {
  //   descriptions.push(
  //     {
  //       name: simulations[i].name,
  //       days: simulations[i].dates[simulations[i].dates.length - 1].days,
  //       rules: simulations[i].dates[simulations[i].dates.length - 1].rules,
  //     });
  // }

  res.status(501).send("Not implemented.");
};

exports.getSimulation = function (req, res) {
  // for (let s = 0; s < simulations.length; s += 1) {
  //   // console.log(simulations[s].name + " equals " + req + "?");
  //   if (simulations[s].name === req) {
  //     res(null, simulations[s]);
  //     return;
  //   }
  // }
  res.status(404).send(`Cannot find simulation named ${req}.`);
};

exports.getSimulationContext = function (req, res) {
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
  res.status(404).send(`Cannot find simulation named ${req}.`);
};

exports.getSimulationTimeline = function (req, res) {
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
  res.status(501).send("Not implemented.");
};

exports.getSimulationDescription = function (req, res) {
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
  res.status(501).send("Not implemented.");
};
