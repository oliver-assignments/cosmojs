const manager = require('../controllers/manager.js');

module.exports = (app) => {
  //  Add a new simulation
  app.post('/worlds', manager.createSimulation);
  app.get('/worlds/descriptions', manager.getSimulationDescriptions);
  app.delete('/worlds', manager.clearSimulations);

  app.get('/worlds/:name/decription', manager.getSimulationDescriptions);
  app.get('/worlds/:name/timeline', manager.getSimulationTimeline);
  app.get('/worlds/:name/:day', manager.getSimulationContext);
  app.get('/worlds/:name/latest', manager.getSimulationContext);
  app.delete('/worlds/:name', manager.deleteSimulation);
};
