angular.module('creationApp',['ngCookies'])
.factory('creationService',['rulesService','simulationManagerService','simulationRendererService','pageService','contextService',
function(rulesService,simulationManagerService,renderer,page,context)
{
  var creationService = {};

  creationService.createSim = function(formData,res)
  {
    simulationManagerService.createSim(formData,function(err,data)
    {
      if(err)
      {
        res(err);
      }
      else
      {
        res(null);
      }
    });
  };
  creationService.navigateToSim = function (name)
  {
    simulationManagerService.pickSim(name,function(err)
      {
        if(err)
        {
          console.log(err)
        }
        else
        {
          renderer.renderWorldAtDateWithMode(
            { 
              name:context.name
              ,days:context.days
            },
            function(err,data) 
            {
              if(err)
              {
                console.log(err);
              }
              else
              {
                page.changePage("Home",
                  function(err)
                  {
                    if(err)
                      console.log(err);
                  });

              }
            });

          simulationManagerService.getSimulationDescriptions(function(err,data)
          {
            if(err)
            {
              console.log(err);
            }
          })
          
        }
      });
  }
  return creationService;

}])
.controller('creationController', ['$scope','$cookies','rulesService','creationService','utilityService',
function($scope,$cookies, rulesService,creationService,utility) 
{
  $scope.rules = rulesService;

  $scope.formData={
     name: ""
    , rotation: 1
    , tilt: 0.75
    , size: '{"columns":50,"rows":40}'
    , plantsPer: 9

    , rules: {
      maturity: true
      , disease: false
      , heliophilia: true
      , thirst: true
      , mutation: 0.999
      , roots: 8
    }
  };
  $scope.isValidNumber = function(n)
  {
    return n != null &&
      n != "" && !isNaN(n);
  };
  $scope.createSim = function()
  {
    for (var i in $scope.formData) 
    {
        if ($scope.formData[i] === null||
          $scope.formData[i] === "" || 
          $scope.formData[i] === undefined || 
          $scope.formData[i] === false) 
        {
            delete $scope.formData[i];
        }
    }

    //  Radio rules
    for( var r = 0 ; r < rulesService.rules.length ; r++ )
    {
      $cookies.put(
        'cosmo-' + rulesService.rules[r].variable, 
        $scope.formData[rulesService.rules[r].variable]);
      // $cookies.put(
      //   'cosmo-' + rulesService.rules[r].variable, 
      //   $scope.formData.rules[rulesService.rules[r].variable]);

      // $cookies.put(
      //   'cosmo-' + rulesService.rules[r].variable, 
      //   $scope.formData.rules[rulesService.rules[r].variable]);
    }

   

    creationService.createSim($scope.formData,
      function(err)
      {
        if(err)
        {
          alert(err);
        }
        else
        {
          creationService.navigateToSim($scope.formData.name);
        }
      });

  };

  $scope.randomizeName = function()
  {
    utility.getRandomName(function(err,data)
      {
        if(err)
        {
          console.log(err);
        }
        else
        {
          $scope.formData.name = data;
        }
      });
  };
  $scope.startApp = function()
  {
    $scope.randomizeName();

    //  Radio rules
    for( var r = 0 ; r < rulesService.rules.length ; r++ )
    {
      if(rulesService.rules[r].ruleType == "radio")
      {
        var radio = $cookies.get('cosmo-' + rulesService.rules[r].variable);
        if(radio) 
        { 
          if(rulesService.rules[r].type == "number")
            radio = Number(radio);
          $scope.formData[rulesService.rules[r].variable] = radio;
        }
      }
      else if (rulesService.rules[r].ruleType == "boolean")
      {    
        var boolean = $cookies.get('cosmo-' + rulesService.rules[r].variable);
        if(boolean) {
          $scope.formData.rules[rulesService.rules[r].variable] = boolean =="true";
        }
      }
      else if (rulesService.rules[r].ruleType == "field")
      {
        var input = $cookies.get('cosmo-' + rulesService.rules[r].variable);
        if(input){
          if(rulesService.rules[r].input.type == "number")
            input = Number(input);
          $scope.formData.rules[rulesService.rules[r].variable] = input;
        }
      }
    }
  };
  $scope.camelize = function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  };

  
  
  $scope.startApp();
}]);

