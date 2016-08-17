'use strict';

var context = require('./context.js');
var util = require('./utility.js');
var request = require('./request.js');

var land = require('./land.js');
var tectonic = require('./tectonic.js');
var weather = require('./weather.js');
var plant = require('./plant.js');
var water = require('./water.js');

var simulations = new Array();

exports.createSimulation = function(req, res) 
{   
  var dimensions = JSON.parse(req.size);

  var simulation = {
    name:      req.name
    , columns: dimensions.columns
    , rows:    dimensions.rows
    , dates:   []
  };

  prepareSimulation(
    context(
      dimensions.columns, dimensions.rows
      , req.plantsPer
      , req.tilt, req.rotation
      , req.rules),
    function(err,ctx)
    {
      if(err) { 
        res(err);
        return;
      }
      request.saveCtx(simulation,ctx);
      simulations.push(simulation);

      res(null,simulations);
    });
};

function prepareSimulation (ctx,res)
{
  land.CreateBlobbyLandmass(ctx);
  water.CreateOcean(ctx, ctx.area * 2);

  tectonic.createTectonicPlates(ctx);
  plant.SprayPlants(ctx);

  weather.SetSunlight(ctx);
  weather.EstimateRainfall(ctx);

  res(null,ctx);
};

exports.deleteSimulation = function(req,res) {
  for(var i = simulations.length-1; i >= 0; --i) {
    var item = simulations[i];

    if(item.name == req) {
      simulations.splice(i, 1);
    }
  }
  res(null,simulations);
};
exports.clearSimulations = function(res) {
  simulations= new Array();
  res(null,simulations);
};

//  Expensive do not use
exports.getSimulations = function(res) {
  res(null,simulations);
};

exports.getSimulationDescriptions = function(res) {
  var descriptions = new Array();
  for(var i = 0 ; i < simulations.length ; i++)
  {
    descriptions.push(
    {
      name: simulations[i].name
      ,days: simulations[i].dates[simulations[i].dates.length-1].days
      ,rules: simulations[i].dates[simulations[i].dates.length-1].rules
    });
  }

  res(null,descriptions);
};

exports.getSimulation=function (req,res)
{
  for(var s = 0 ; s < simulations.length;s++)
  {
    //console.log(simulations[s].name + " equals " + req + "?");
    if(simulations[s].name == req)
    {
      res(null, simulations[s]);
      return;
    }
  }
  res("Cannot find simulation named " + req + ".");
};

exports.getSimulationContext = function (req,res)
{
  exports.getSimulation(req.name,function(err,simulation)
  {
    if(err)
    {
      res(err);
    }
    else
    {
      if(req.days == undefined)
      {
        if(simulation.dates.length>0)
        {
          res(null,simulation.dates[simulation.dates.length-1]);
        }
        else
        {
          res("Cannot get simulation context of empty dates.");
        }
      }
      else
      {
        for( var d = simulation.dates.length-1 ; d >= 0 ; d--)
        {
          if(simulation.dates[d].days == req.days)
          {
            res(null,simulation.dates[d]);
            return;
          }
        }
        res("Simulation named " + req.name + " does not have date " + req.days + "d.");
      }
    }
  });
};

exports.getSimulationTimeline = function(req,res) {
  
  exports.getSimulation(req,function(err,simulation) {
    
    if(err) 
    { 
      res(err);
    }
    else
    {
      var dates = new Array();
      for (var d = 0 ; d < simulation.dates.length;d++)
      {
        dates.push(simulation.dates[d].days)
      }
      res(null, dates);
    }
  });
};

exports.getSimulationDescription = function(req,res) {

  // console.log("Get simulation description");
  // console.log(req);

  exports.getSimulation(req,function(err,simulation) {
    
    if(err) { 
      res(err);
    }
    else {

      res(null, {
        name: simulation.name
        ,days: simulation.dates[simulation.dates.length-1].days
        ,rules: simulation.dates[simulation.dates.length-1].rules
      });
    }
      
  });
};




