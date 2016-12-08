angular.module('simulationManagerApp')
  .factory('simulationManagerService', ['$http', 'simulationRendererService', 'timelineService','pageService','contextService',
  ($http,renderer,timeline,pager,context) => {
    var manager = {};
    manager.simulations = [];

    manager.pickRandom = (res) => {
      if(manager.simulations.length>0) {
        var index = Math.floor(Math.random() * manager.simulations.length);
        manager.pickSim(manager.simulations[index].name,res); 
        res(null);
      } else {
        res("Cannot pick random if there are no simulations.")
      }
    };

    manager.pickSim = (name,res) => {
      for(var s = 0 ; s < manager.simulations.length;s++) {
        if(manager.simulations[s].name == name) {
          context.name = name;
          pager.changePage('Home',function(err){});

          //update dates
          timeline.getDates((err,data) => {
            if(err) {
              res(err);
            } else {
              //  pick latest date
              timeline.pickLatestDate((err,data) => {
                if(err) {
                  console.log(err);
                }
              });
            }
          });
        }
      }
      res(null);
    };

    manager.pickSimIndex = (i) => {
      if(manager.simulations.length>0) {
        if(i < manager.simulations.length) {
          manager.pickSim(manager.simulations[i].name);
        }
      }
    };

    manager.getSimulationDescriptions = (res) => {
      $http.get('/worlds/descriptions')
        .success((data) => {
          manager.simulations = data;
          res(null,data);
        })
        .error((data) => {
          res('Cannot find simulations. ' + data);
        });
    };
    
    manager.createSim = (form,res) => {
      console.log(form);
      $http.post('/worlds', form)
        .success((data) => {
          manager.simulations = data;
          res(null,data);
        })
        .error((data) => {
          res('Create sim error: ' + data.error);
        });
    };
    manager.deleteSim = (name,res) => {
      console.log("Attempting to delete " + name);

      $http.delete('/worlds/' + name)
        .success((data) => {
          manager.simulations = data;
          res(null,data);
        })  
        .error((data) => {
          res('Delete sim error: ' + data);
        });   
    };

    manager.clearSims = (res) => {
      //console.log('Attempting to delete all sims.');

      $http.delete('/worlds/')
        .success((data) => {
          manager.simulations = data;
          res(null,data);
        })  
        .error((data) => {
          res('Delete sim error: ' + data);
        
        }); 
    };
    
    return manager;
  }]);