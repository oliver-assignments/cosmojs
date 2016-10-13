const manager = require('../src/manager.js');

module.exports = (app) => {
  //  Add a new simulation
  app.post('/', (req, res) => {
    manager.createSimulation(req.body,
      (err, sims) => {
        if (err) {
          // res.send(err);
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(sims);
        }
      });
  });

  //  Get all the simulation descriptions
  app.get('/descriptions', (req, res) => {
    manager.getSimulationDescriptions(
      (err, packages) => {
        if (err) {
          // res.send(err);
          // return;
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(packages);
        }
      });
  });

  app.delete('/', (req, res) => {
    manager.clearSimulations(
      (err, sims) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(sims);
        }
      });
  });

  //  Deletse a simulation
  app.delete('/:name', (req, res) => {
    manager.deleteSimulation(req.params.name,
      (err, sims) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(sims);
        }
      });
  });


  //  Get the basic pacakge of world
  app.get('/:name/decription', (req, res) => {
    //  Return name, dimensions
    manager.getSimulationPackage(
      req.params.name,
      (err, glimpse) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(glimpse);
        }
      });
  });

  app.get('/:name/latest', (req, res) => {
    manager.getSimulationContext(
      {
        name: req.params.name,
      },
      (err, sim) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(sim);
        }
      });
  });

  //  Get all the saved date names
  app.get('/:name/timeline', (req, res) => {
    manager.getSimulationTimeline(req.params.name,
      (err, timeline) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(timeline);
        }
      });
  });

  app.get('/:name/:days', (req, res) => {
    manager.getSimulationContext(
      {
        name: req.params.name,
        days: req.params.days,
      },
      (err, sim) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(sim);
        }
      });
  });
};
