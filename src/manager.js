'use strict';

var request = require('./request.js');
var soilScape = require('../../soil-scape/index.js');

var simulations = new Array();

exports.createSimulation = function(req,res) {
  var world = soilScape.createSimulation(req);

  var simulation = {
    name: world.name
    , dates: []
  };

  simulation.dates.push(world);
  simulations.push(simulation);
  res(null, simulations);
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