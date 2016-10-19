angular.module('rulesApp')
  .filter('wrapInQuotes', () => {
    return (input) => {
      if (typeof input === 'string' || input instanceof String)
        return "'" + input + "'";
    else
        return input;
    };
  })
  .filter('inputPlaceholder', () => {
    return (input) => {
      var string = "";

      if(!input) {
        return string;
      }

      if(input.type) {
        string+= input.type + " ";
      }
      if(input.left !=null) {
        if(input.left.inclusive == null || input.left.inclusive) {
          string += "[";
        } else {
          //  It's inclusive by default
          string += "(";
        }
        string += input.left.value + ", ";
      } else {
        //  left is infinity
        string += "(-∞, "
      }

      if(input.right !=null) {
        
        string += input.right.value;
        if(input.right.inclusive == null || input.right.inclusive) {
          string += "]";
        } else {
          //  It's inclusive by default
          string += ")";
        }
      } else {
        //  left is infinity
        string += "∞)"
      }
      return string;
    };
  }]);

