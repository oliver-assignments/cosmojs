"use strict"

const renderer = require('../src/render.js');

//     Render apis    //
module.exports = (app) => {
  //  Gets the current data of a world
  app.get('/:name/latest/:mode', (req, res) => {
    renderer.renderSimulationContextWithMode(
      {
        name: req.params.name,
        mode: req.params.mode,
      },
      (err, renderInstructions) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(renderInstructions);
        }
      });
  });

  //  Get teh world map data at a specifc date
  app.get('/:name/:days/:mode', (req, res) => {
    renderer.renderSimulationContextWithMode(
      {
        name: req.params.name,
        mode: req.params.mode,
        days: req.params.days,
      },
      (err, renderInstructions) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(renderInstructions);
        }
      });
  });
};
