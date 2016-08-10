'use strict';

var simulate = require('./simulate.js');
var manager = require('./manager.js');
var utility = require('./utility.js');
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
    // console.log(item);
    // console.log(request);

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
exports.saveCtx = function(simulation, ctx)
{
  simulate.calculateHighest(ctx);
  simulation.dates.push(utility.cloneObject(ctx));
}
exports.processSimulationRequests = function(res)
{
  var lastOutputDay = 0;
  for(var r = 0 ; r < requests.length; r++) 
  {
    manager.getSimulation(requests[r].name,function(err,simulation)
    {
      if(err)
      {
        res(err);
        return;
      }
      var copyCtx = utility.cloneObject(simulation.dates[simulation.dates.length-1]);
      //  Actually simulate this
      for(var d = 0 ; d < requests[r].days ; d++)
      {
        copyCtx.days++;

        if(copyCtx.days % 30 == 0)
        {
          if(copyCtx.days % 360 == 0)
          {
            //  Yearly logic
            simulate.onYear(copyCtx, function(err,nothing)
            {
              if(err)
              {
                res("Problem with crossing the year");
                return;
              }
            });
          }

          //  Monthly logic
          simulate.onMonth(copyCtx,function(err,nothing)
          {
            if(err)
            {
              res("Problem with crossing the month");
              return;
            }
          });
        }

        //  Weekly Logic
        if(copyCtx.days % 30 == 0 && lastOutputDay != copyCtx.days)
        {
          //Save
          exports.saveCtx(simulation,copyCtx);
          lastOutputDay = copyCtx.days;
        }

        //  Daily logic
        simulate.simulateDay(copyCtx,function(err,nothing)
        {
          if(err)
          {
            res("Problem wiht simulating a day");
            return;
          }

        });
        
      }
      if(requests[r].days < 30 && lastOutputDay != copyCtx.days) {
        //Save if under a week
        exports.saveCtx(simulation,copyCtx);
        lastOutputDay = copyCtx.days;
      }
    
    });
  }
  requests = new Array();
  res(null,requests);
};