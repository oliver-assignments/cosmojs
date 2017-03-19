angular.module('contextApp')
  .factory('contextService', [() => {
    var context = {
      name: 'No Simulation'
      ,id: "0000"
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