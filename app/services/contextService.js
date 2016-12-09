angular.module('contextApp')
  .factory('contextService', [() => {
    var context = {
      name: 'No Simulation'
      ,days: 0
      ,columns: 0
      ,rows: 0
      ,mode: 'Satellite'
      ,snapshot: {}
    };

    context.getSim = (res) => {
      if(context.name == "No Simulation") {
        res("Simulation hasn't been picked yet.");
      } else {
        res(null,context);
      }
    };
    return context;
  }]);