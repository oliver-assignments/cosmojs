angular.module("timelineApp")
  .factory('timelineService',['$http','contextService','simulationRendererService', ($http, context, renderer) => {
    var timeline = {};
    
    timeline.dates = [];

    timeline.getDates = (res) => {
      context.getSim((err,picked) => {
        if(err) {
          res(err);
        } else {
          $http.get('/worlds/' + context.name + '/timeline')
            .success((data) => {
              timeline.dates = data;
              res(null,data);
            })
            .error((data) => {
              res('Get simulation requests error: ' + data);
            });
        }
      });
    };
    timeline.pickLatestDate = (res) => {
      timeline.pickDate( timeline.dates[timeline.dates.length-1], res );
    }

    timeline.jumpToNextDate = (direction,res) => {
      for(var d = 0 ; d < timeline.dates.length; d++) {
        if(context.days == timeline.dates[d]) {
          if(direction == -1) {
            if(d-1 >= 0) {
              timeline.pickDate(timeline.dates[d-1],res);
            }
          } else if(direction == 1) {
            if(d+1 < timeline.dates.length) {
              timeline.pickDate(timeline.dates[d+1],res);
            }
          }
        }
      }
    };

    timeline.pickDate = (time,res) => {
      renderer.renderWorldAtDateWithMode(
        {
          name:context.name
          ,days:time
          ,mode:context.mode
          
        }
        ,(err,data) => {
          if(err) {
            res(err);
          } else {
            context.days = time;
            res(null,data);
          }
        });
    };
    return timeline;
  }]);