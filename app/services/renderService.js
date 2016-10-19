angular.module('simulationRendererApp')
  .factory('simulationRendererService',['$http','contextService', ($http,context) => {
    var renderer = {};

    renderer.modeSections = [
        {name:"Flora Stats",  modes : ["Density","Nutrient Stores", "Nutro Stores", "Nucium Stores", "Water Stores", "Growth", "Generation"]} 
      , {name:"Flora DNA",    modes : ["Heliophilia", "Thirst"]}  
      , {name:"Geography",  modes : ["Satellite", "Depth", "Elevation", "Height"]}
      , {name:"Mantle",     modes : ["Tectonic", "Asthenosphere", "Stress"]}//  "Fractures"
      , {name:"Soil",       modes : ["Nutrients", "Nutro", "Nucium"]}
      , {name:"Weather",    modes : ["Sunlight", "Rainfall"]}
    ];

    renderer.changeMapMode = (req,res) => {
      if(req != context.mapMode) {
        renderer.renderWorldAtDateWithMode(
          { 
            name:context.name
            ,mode:req
            ,days:context.days
          },
          (err,data) => {
            if(err) {
              res(err);
            } else {
              context.mode = req;
              res(null);
            }
          });
      }
    };

    renderer.renderWorldAtDateWithMode = (req,res) => {
      var date = "latest";
      if(req.days !=null) {
        date = req.days;
      }

      $http.get('/render/' + req.name + "/" + date + "/" + req.mode)
        .success((renderInstructions) => {
          renderer.mode = req.mode;
          
          var canvas = document.getElementById("canvas");
          if(!canvas) {
            return;
          }
          var ctx = canvas.getContext("2d");

          var width = canvas.width / renderInstructions.columns;
          var height = canvas.height / renderInstructions.rows;

          for(var x = 0 ; x < renderInstructions.columns; x++) {
            for(var y = 0 ; y < renderInstructions.rows; y++) {
              var z = (y * renderInstructions.columns)+x;
              ctx.save();
              ctx.fillStyle = renderInstructions.colors[z];

              ctx.fillRect(
                width*x,
                height*y,
                width+1,
                height+1);

              ctx.restore();
            }
          } 

          res(null,renderInstructions)
        })
        .error((err) => {
          res("Error updating colors: " + err);
        }); 
      };
    
    return renderer;
  }]);