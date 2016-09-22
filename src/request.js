'use strict';

var soilScape = require('../../soil-scape/index.js');
var manager = require('./manager.js');

var requests = new Array();

exports.queueSimulationRequest = function(request,res) {
  
  if(request.name && request.days)
  {
    if(request.days >= 1)
    {
      //  Do we have that simulation?
      manager.getSimulation(request.name,function(err,data)
        {
          if(err)
          {
            res(err);
          }
          else
          {
            requests.push(request);
            res(null,requests);
          }
        });       
    }
    else
    {
      res(request.name + " cannot be simulated for " + request.days + ". Year values must be above 0.", requests);
    }
  }
  else 
  {
    res("Bad or missing request data.",requests);
  }
};

exports.deleteSimulationRequestsForWorld = function(request,res) {
  
  for(var i = requests.length-1; i >= 0; --i) {
    var item = requests[i];

    if(item.name == request.name) {
      requests.splice(i, 1);
    }
  }
  res(null,requests);
};

exports.getSimulationRequests = function(res) {
  res(null,requests);
};

exports.clearSimulationRequests = function(res) {
  requests = new Array();
  res(null,requests);
};
// exports.saveCtx = function(simulation, ctx)
// {
//   simulate.calculateHighest(ctx);
//   simulation.dates.push(utility.cloneObject(ctx));
// }

exports.processSimulationRequests = function(res)
{
  var lastOutputDay = 0;
  for(var r = 0 ; r < requests.length; r++) 
  {
    // manager.getSimulation(requests[r].name,function(err,simulation)
    // {
      // if(err)
      // {
      //   res(err);
      //   return;
      // }
      // var newDates = soilScape.simulate(simulation.dates[simulation.dates.length-1], request[r].days, 10);
      // for(var d = 0 ; d < newDates.length; d++)
      //   simulation.dates.push(newDates[d]);
      //}
  }
  requests = new Array();
  res(null,requests);
};