    angular.module('creationApp')
  .factory('creationService',['rulesService','simulationManagerService','simulationRendererService','pageService','contextService',
  (rulesService,simulationManagerService,renderer,page,context) => {
    var creationService = {};

    creationService.createSim = (formData,res) => {
      simulationManagerService.createSim(formData, (err,data) => {
        if(err) {
          res(err);
        } else {
          res(null);
        }
      });
    };
    creationService.navigateToSim = (name) => {
      simulationManagerService.pickSim(name, (err) => {
        if(err) {
          console.log(err)
        } else {
          renderer.renderWorldAtDateWithMode(
            { 
              name:context.name
              ,days:context.days
            },
            (err,data) => {
              if(err) {
                console.log(err);
              } else {
                page.changePage("Home", (err) => {
                  if(err) {
                    console.log(err);
                  }
                });
              }
            });

          simulationManagerService.getSimulationDescriptions((err,data) => {
            if(err) {
              console.log(err);
            }
          })
        }
      });
    }
    return creationService;
  }]);