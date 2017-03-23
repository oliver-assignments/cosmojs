const renderer = require('../controllers/render.js');

module.exports = (app) => {
  //app.get("render/:id/latest/:mode", renderer.renderSimulation);
  //app.get("render/:id/:day/:mode", renderer.renderSimulation);
};

//     Render apis    //
// module.exports = (app) => {
  //  Gets the current data of a world
  // app.get('/render/:name/latest/:mode', renderer.renderSimulationContextWithMode);
  //     {
  //       name: req.params.name,
  //       mode: req.params.mode,
  //     },
  //     (err, renderInstructions) => {
  //       if (err) {
  //         res.status = (err.status || 500);
  //         res.json(err);
  //       } else {
  //         res.json(renderInstructions);
  //       }
  //     });
  // });

  //  Get teh world map data at a specifc date
  // app.get('/render/:id/:mode', renderer.renderSimulationContextWithMode);
// };
