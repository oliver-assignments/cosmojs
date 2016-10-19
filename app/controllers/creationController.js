angular.module('creationApp')
  .controller('creationController', ['$scope','$cookies','rulesService','creationService','utilityService',
  ($scope,$cookies, rulesService,creationService,utility) => {
    $scope.rules = rulesService;

    $scope.formData = {
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
    $scope.isValidNumber = (n) => {
      return n != null && n != "" && !isNaN(n);
    };
    $scope.createSim = () => {
      for (var i in $scope.formData) {
        if ($scope.formData[i] === null||
          $scope.formData[i] === "" || 
          $scope.formData[i] === undefined || 
          $scope.formData[i] === false) {
            delete $scope.formData[i];
        }
      }

      //  Radio rules
      for( var r = 0 ; r < rulesService.rules.length ; r++ ) {
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

      creationService.createSim($scope.formData, (err) => {
        if(err) {
          alert(err);
        } else {
          creationService.navigateToSim($scope.formData.name);
        }
      });

    };

    $scope.randomizeName = () => {
      utility.getRandomName((err,data) => {
        if(err) {
          console.log(err);
        } else {
          $scope.formData.name = data;
        }
      });
    };

    $scope.startApp = () => {
      $scope.randomizeName();

      //  Radio rules
      for( var r = 0 ; r < rulesService.rules.length ; r++ ) {
        if(rulesService.rules[r].ruleType == "radio") {
          var radio = $cookies.get('cosmo-' + rulesService.rules[r].variable);
          if(radio) { 
            if(rulesService.rules[r].type == "number") {
              radio = Number(radio);
            }
            $scope.formData[rulesService.rules[r].variable] = radio;
          }
        } else if (rulesService.rules[r].ruleType == "boolean") {    
          var boolean = $cookies.get('cosmo-' + rulesService.rules[r].variable);
          if(boolean) {
            $scope.formData.rules[rulesService.rules[r].variable] = boolean =="true";
          }
        } else if (rulesService.rules[r].ruleType == "field") {
          var input = $cookies.get('cosmo-' + rulesService.rules[r].variable);
          if(input) {
            if(rulesService.rules[r].input.type == "number") {
              input = Number(input);
            }
            $scope.formData.rules[rulesService.rules[r].variable] = input;
          }
        }
      }
    };
    $scope.camelize = (str) => {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '');
    };
        
    $scope.startApp();
  }]);

