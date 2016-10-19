angular.module('simulationRequestsApp')
  .factory('simulationRequestsService',['$http','simulationManagerService','timelineService','contextService',
  ($http,simManager,timeline,context) => {
    var service = {};
    service.requests = [];
    service.getSimulationRequests = (res) => {
      $http.get('/requests')
        .success((data) => {
          service.requests = data;
          res(null,data);
        })
        .error((data) => {
          res('Get simulation requests error: ' + data);
        });
    };
    service.createSimulationRequest = (req,res) => {
      context.getSim((err,picked) => {
        if(err) {
          console.log(err);
        } else {
          $http.post('/requests', req)
            .success((data) => {
              service.requests=data;
              res(null,data);
            })
            .error((data) => {
              res('Create simulation requests error: ' + data);
            });
            
        }
      }); 
    };
    service.clearSimulationRequests = (res) => {
      $http.delete('/requests')
        .success((data) => {
          service.requests = data;
          res(null,data);
        })
        .error((data) => {
          res('Clear simulation requests error: ' + data);
        });
    };
    service.deleteSimulationsRequests = (req,res) => {
      $http.delete('/requests/' + req)
        .success((data) => {
          service.requests=data;
          res(null,data);
        })
        .error((data) => {
          res('Delete ' + name +' simulation request error: ' + data);
        });
    };
    service.processSimulationRequests = (res) =>  {
      $http.post('/requests/process')
      .success((requests) => {
        service.requests = requests;

        simManager.getSimulationDescriptions((err,data) => {
          if(err) {
            console.log(err);
          } else {
            timeline.getDates((err,data) => {
              if(err) {
                console.log(err);
              }
            });
          }
        });
      })
      .error((data) => {
        res('Process simulation requests error: ' + data);
      }); 
    };
    return service;
  }]);