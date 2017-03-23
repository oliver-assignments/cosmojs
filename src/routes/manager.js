const manager = require('../controllers/manager.js');

module.exports = (app) => {
  //  Add a new simulation
  app.post('/worlds', manager.createWorld);
  app.get('/worlds/descriptions', manager.getWorldDescriptions);
  //app.delete('/worlds', manager.clearSimulations);

  // app.get('/worlds/:id/decription', manager.getSimulationDescriptions);
  // app.get('/worlds/:id/timeline', manager.getSimulationTimeline);
  // app.get('/worlds/:id/:day', manager.getSimulationContext);
  // app.get('/worlds/:id/latest', manager.getSimulationContext);
  // app.delete('/worlds/:id', manager.deleteSimulation);
};
