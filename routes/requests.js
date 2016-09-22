'use strict';
var requests = require('../src/request.js');

module.exports = function(app) {
    //  Get all simulation requests
  app.get('/',function(req,res)
  {
    requests.getSimulationRequests(function(err,requests)
      {
        if(err){
          res.status = (err.status || 500);
          res.json(err);
        }
        else
          res.json(requests);
      });
  });
  //  Post new simulation request
  app.post('/',function(req,res)
  {
    requests.queueSimulationRequest(req.body,
      function(err,requests)
      {
        if(err){
          res.status = (err.status || 500);
          res.json(err);
        }
        else
          res.json(requests);
      });
  });
  //  Clear simulation requests
  app.delete('/',function(req,res)
  {
    requests.clearSimulationRequests(
      function(err,requests)
      {
        if(err){
          res.status = (err.status || 500);
          res.json(err);
        }
        else
          res.json(requests);
      });
  });
  //  Delete all simulation requests of worldname
  app.delete('/:name',function(req,res)
  {
    requests.deleteSimulationRequestsForWorld(req.params,
      function(err,requests)
      {
        if(err){
          res.status = (err.status || 500);
          res.json(err);
        }
        else
          res.json(requests);
      });
  });
  app.post('/process',function(req,res)
  {
    requests.processSimulationRequests(
      function(err,requests)
      {
        if(err){
          res.status = (err.status || 500);
          res.json(err);
        }
        else
          res.json(requests);
      });
  });
};


