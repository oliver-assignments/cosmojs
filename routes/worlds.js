'use strict';

var manager = require("../src/manager.js");

module.exports = function(app) {
  //  Add a new simulation
  app.post('/', function(req,res)
  {
    manager.createSimulation(req.body, 
      function(err,sims)
      {
        if(err) {
          // res.send(err);
          res.status = (err.status || 500);
          res.json(err);
        }
        else {
          res.json(sims);     
        }
      }); 
  });

  //  Get all the simulation descriptions
  app.get('/descriptions', function(req,res)
  {
    manager.getSimulationDescriptions(
      function(err,packages)
      {
        if(err){
          // res.send(err);
          // return;
          res.status = (err.status || 500);
          res.json(err);
        }
        else 
          res.json(packages);           
      }); 
  });

  app.delete('/', function(req,res)
  {
    manager.clearSimulations(
      function(err,sims)
      {
        if(err)
        {
          res.status = (err.status || 500);
          res.json(err);
        }
        else
          res.json(sims);     
    });
  });

  //  Deletse a simulation
  app.delete('/:name', function(req,res)
  {
    manager.deleteSimulation(req.params.name,
      function(err,sims)
      {
        if(err){
          res.status = (err.status || 500);
          res.json(err);
        }
        else
          res.json(sims);     
      });
  });

  

  //  Get the basic pacakge of world
  app.get('/:name/decription', function(req,res)
  {
    //  Return name, dimensions 
    manager.getSimulationPackage(
      req.params.name,
      function(err,glimpse)
      {
        if(err){
          res.status = (err.status || 500);
          res.json(err);
      }
      else
        wres.json(glimpse);     
    });
  });

  app.get('/:name/latest', function(req,res)
  {
    manager.getSimulationContext(
      {
        name:req.params.name
      },
      function(err,sim) {
        if(err) {
          res.status = (err.status || 500);
          res.json(err);
        }
        else
          res.json(sim);
      });
  });

  //  Get all the saved date names
  app.get('/:name/timeline', function(req,res)
  {
    manager.getSimulationTimeline(req.params.name,
      function(err,timeline) {
        if(err)
        {
          res.status = (err.status || 500);
          res.json(err);
        }
        else
        {
          res.json(timeline);
        }
      });
  });

  app.get('/:name/:days', function(req,res)
  {
    manager.getSimulationContext(
      {
        name: req.params.name
        ,days: req.params.days
      },
      function(err,sim) {
        if(err) {
          res.status = (err.status || 500);
          res.json(err);
        }
        else
        {
          res.json(sim);
        }
      });
  });
};