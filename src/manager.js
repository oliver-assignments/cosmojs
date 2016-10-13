const soilScape = require('../../soil-scape/index.js');

let simulations = [];

exports.createSimulation = function (req, res) {
  const world = soilScape.createSimulation(req);

  const simulation = {
    name: world.name,
    dates: [],
  };

  simulation.dates.push(world);
  simulations.push(simulation);
  res(null, simulations);
};

exports.deleteSimulation = function (req, res) {
  for (let i = simulations.length - 1; i >= 0; i -= 1) {
    const item = simulations[i];

    if (item.name === req) {
      simulations.splice(i, 1);
    }
  }
  res(null, simulations);
};
exports.clearSimulations = function (res) {
  simulations = [];
  res(null, simulations);
};

//  Expensive do not use
exports.getSimulations = function (res) {
  res(null, simulations);
};

exports.getSimulationDescriptions = function (res) {
  const descriptions = [];
  for (let i = 0; i < simulations.length; i += 1) {
    descriptions.push(
      {
        name: simulations[i].name,
        days: simulations[i].dates[simulations[i].dates.length - 1].days,
        rules: simulations[i].dates[simulations[i].dates.length - 1].rules,
      });
  }

  res(null, descriptions);
};

exports.getSimulation = function (req, res) {
  for (let s = 0; s < simulations.length; s += 1) {
    // console.log(simulations[s].name + " equals " + req + "?");
    if (simulations[s].name === req) {
      res(null, simulations[s]);
      return;
    }
  }
  res(`Cannot find simulation named ${req}.`);
};

exports.getSimulationContext = function (req, res) {
  exports.getSimulation(req.name, (err, simulation) => {
    if (err) {
      res(err);
      return;
    }

    if (req.days === undefined) {
      if (simulation.dates.length > 0) {
        res(null, simulation.dates[simulation.dates.length - 1]);
      } else {
        res('Cannot get simulation context of empty dates.');
      }
    } else {
      for (let d = simulation.dates.length - 1; d >= 0; d -= 1) {
        if (simulation.dates[d].days === req.days) {
          res(null, simulation.dates[d]);
          return;
        }
      }
      res(`Simulation named ${req.name} does not have date ${req.days}d.`);
    }
  });
};

exports.getSimulationTimeline = function (req, res) {
  exports.getSimulation(req, (err, simulation) => {
    if (err) {
      res(err);
      return;
    }
    const dates = [];
    for (let d = 0; d < simulation.dates.length; d += 1) {
      dates.push(simulation.dates[d].days);
    }
    res(null, dates);
  });
};

exports.getSimulationDescription = function (req, res) {
  exports.getSimulation(req, (err, simulation) => {
    if (err) {
      res(err);
      return;
    }
    res(null, {
      name: simulation.name,
      days: simulation.dates[simulation.dates.length - 1].days,
      rules: simulation.dates[simulation.dates.length - 1].rules,
    });
  });
};
