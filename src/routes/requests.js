"use strict"
const requestsManager = require('../src/request.js');

module.exports = (app) => {
    //  Get all simulation requests
  app.get('/', (req, res) => {
    requestsManager.getSimulationRequests(
      (err, requests) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(requests);
        }
      });
  });
  //  Post new simulation request
  app.post('/', (req, res) => {
    requestsManager.queueSimulationRequest(req.body,
      (err, requests) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(requests);
        }
      });
  });
  //  Clear simulation requests
  app.delete('/', (req, res) => {
    requestsManager.clearSimulationRequests(
      (err, requests) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(requests);
        }
      });
  });
  //  Delete all simulation requests of worldname
  app.delete('/:name', (req, res) => {
    requestsManager.deleteSimulationRequestsForWorld(req.params,
      (err, requests) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(requests);
        }
      });
  });
  app.post('/process', (req, res) => {
    requestsManager.processSimulationRequests(
      (err, requests) => {
        if (err) {
          res.status = (err.status || 500);
          res.json(err);
        } else {
          res.json(requests);
        }
      });
  });
};

