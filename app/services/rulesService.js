angular.module('rulesApp')
  .factory('rulesService', [ () => {
    var rulesService = {};
    rulesService.options = {};

    rulesService.rules = [
      {
        ruleType: "header"
        , text: "Planet"
      }
      ,{
        title: "Size"
        , ruleType: "radio"
        , description: "Planet size dictates the size and resolution of the simulation. Larger plant and animal populations and more complex continental shapes are possible with a bigger map."
        , options: [
          { name: "Small", value: '{"columns":50,"rows":40}' }
          , { name: "Large", value: '{"columns":100,"rows":80}' }
        ]
        , variable: "size"
        , type: "string"
        , init: "Small"
      }
      ,{
        title: "Tilt"
        , ruleType: "radio"
        , description: "Planet tilt dictates which hemisphere recieves the most sun. For instance the Earth's 23.5 degree tilt means that the sourthern hemisphere recieves the most sunlight annually. Sunlight allows for dense foliage and heavy rainfall."
        , options: [
          { name: "Northern Hemisphere", value: 0.25 }
          , { name: "Equator", value: 0.5 }
          , { name: "Southern Hemisphere", value: 0.75 }
        ]
        , variable: "tilt"
        , type: "number"
        , init: 0.75
      }
      ,{
        title: "Rotation Direction"
        , ruleType: "radio"
        , description: "Planet rotation dictates which direction the rainfall flows. For instance, Earth's west to east rotation means that its greater wind currents flow east to west. Continental geography in the East cuts off warm currents from reaching the West."
        , options: [
          { name: "East to West", value: -1 }
          , { name: "West to East", value: 1 }
        ]
        , variable: "rotation"
        , type: "number"
        , init: -1
      }
      , {
        ruleType: "header"
        , text: "Plants"
      }
      ,{
        title: "Plants per Province"
        , ruleType: "radio"
        , description: "The more plants share a plot the more they have to compete for shared soil nutrients."
        , options: [
          { name: "Four", value: 4 }
          , { name: "Nine", value: 9 }
          , { name: "Sixteen", value: 16 }
        ]
        , variable: "plantsPer"
        , type: "number"
        , init: 9
      }
      ,{
        character: "M"
        , required: "S"
        , title: "Maturity"
        , ruleType: "boolean"
        , tooltip: "Plants must mature before they can reproduce. Requires seeding."
        , variable: "maturity"
        , init: false
      }
      ,{
        character: "H"
        , title: "Heliophilia"
        , ruleType: "boolean"
        , tooltip: "Plants love the sun."
        , variable: "heliophilia"
        , init: false
      }
      ,{
        character: "T"
        , title: "Thirst"
        , ruleType: "boolean"
        , tooltip: "Plants love the rain."
        , variable: "thirst"
        , init: false
      }
      ,{
        character: "R"
        , title: "Root Competition"
        , ruleType: "field"
        , tooltip: "Plants die if they have too many neighbors n."
        , input: {
          type:"number"
          , left: {value:1, inclusive: true}
          , right: {value:9, inclusive: false}
        }
        , variable: "roots"
        , init: 8
      },
      {
        character: "S"
        , title: "Gene Mutation Rate"
        , ruleType: "field"
        , tooltip: "Plants reproduce if they have stored their nutrient endowment. Each of the parent's chromosomes is passed on with m chance of mutating."
        , input:  {
          type: "number"
          , left: {value:0, inclusive:true}
          , right: {value:1, inclusive: true}
        }
        , variable: "mutation"
        , init: 0.999

      }
    ];
    return rulesService;
  }]);

