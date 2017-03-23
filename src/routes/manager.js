const manager = require('../controllers/manager.js');

module.exports = (app) => {
  //  Add a new simulation
  app.post('/worlds', manager.createWorld);
  app.get('/worlds/descriptions', manager.getWorldDescriptions);
  //app.delete('/worlds', manager.clearSimulations);

  // app.get('/worlds/:name/decription', manager.getSimulationDescription);
  app.get('/worlds/:name/timeline', manager.getSimulationTimeline);
  // app.get('/worlds/:name/:day', manager.getSimulationContext);
  // app.get('/worlds/:name/latest', manager.getSimulationContext);
  // app.get('/worlds/:id', manager.getSimulationContext);
  // app.delete('/worlds/:id', manager.deleteSimulation);
};
