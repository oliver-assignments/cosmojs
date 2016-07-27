angular.module('rulesApp',[])
.filter('wrapInQuotes', function() {
  return function(input) {
  	if (typeof input === 'string' || input instanceof String)
  		return "'" + input + "'";
	else
	  	return input;
  };
})
.filter('inputPlaceholder', function() {
  return function(input) {
  	var string = "";
	if(input.type)
	{
		string+= input.type + " ";
	}
	if(input.left !=null)
	{
		if(input.left.inclusive == null || input.left.inclusive)
		{
			string += "[";
		}
		else
		{
			//  It's inclusive by default
			string += "(";
		}
		string += input.left.value + ", ";
	}
	else
	{
		//  left is infinity
		string += "(-∞, "
	}

	if(input.right !=null)
	{
		
		string += input.right.value;
		if(input.right.inclusive == null || input.right.inclusive)
		{
			string += "]";
		}
		else
		{
			//  It's inclusive by default
			string += ")";
		}
	}
	else
	{
		//  left is infinity
		string += "∞)"
	}
	return string;
  };
})
.factory('rulesService', [
function()
{
	var rules = {};
	rules.options = {};

	rules.radios =
	[
		{
			title: "Size"
			, description: "Planet size dictates the size and resolution of the simulation. Larger plant and animal populations and more complex continental shapes are possible with a bigger map."
			, options: [
				{ name: "Tiny", value: '{"columns":50,"rows":40}' }
				, { name: "Small", value: '{"columns":100,"rows":80}' }
				, { name: "Medium", value: '{"columns":150,"rows":120}' }
				, { name: "Large", value: '{"columns":200,"rows":160}' }
			]
			, variable: "size"
			, type: "string"
			, init: "small"
		}
		,{
			title: "Tilt"
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
			, description: "Planet rotation dictates which direction the rainfall flows. For instance, Earth's west to east rotation means that its greater wind currents flow east to west. Continental geography in the East cuts off warm currents from reaching the West."
			, options: [
				{ name: "East to West", value: -1 }
				, { name: "West to East", value: 1 }
			]
			, variable: "rotation"
			, type: "number"
			, init: -1
		}
		,{
			title: "Plants per Province"
			, description: "The more plants share a plot the more they have to compete for shared soil nutrients."
			, options: [
				{ name: "One", value: 1 }
				, { name: "Four", value: 4 }
				, { name: "Nine", value: 9 }
				, { name: "Sixteen", value: 16 }
				, { name: "Twenty Five", value: 25 }
			]
			, variable: "plantsPer"
			, type: "number"
			, init: 9
		}
	];
	rules.booleans = 
	[
		// {
		// 	character: "C"
		// 	, title: "Consumption"
		// 	, tooltip: "Plants consume nutrients from the soil equal to their metabolism."
		// 	, variable: "consumption"
		// 	, init: false
		// }
		//,
		{
			character: "W"
			, title: "Water"
			, tooltip: "Plants recieve and store water from rainfall, and need it to survive."
			, variable: "water"
			, init: false
		}
		,{
			character: "M"
			, required: "S"
			, title: "Maturity"
			, tooltip: "Plants must mature before they can reproduce. Requires seeding."
			, variable: "maturity"
			, init: false
		}
		,{
			character: "D"
			, title: "Disease"
			, tooltip: "Disease infects and kills plants."
			, variable: "disease"
			, init: false
		}
	];
	rules.fields = 
	[
		{
			character: "R"
			, title: "Root Competition"
			, tooltip: "Plants die if they have too many neighbors n."
			, input: {
				type:"number",
				left: {value:1, inclusive: true},
				right: {value:9, inclusive: false}
			}
			, variable: "roots"
			, init: 8
		},
		{
			character: "S",
			title: "Gene Mutation Rate",
			tooltip: "Plants reproduce if they have stored their nutrient endowment. Each of the parent's chromosomes is passed on with m chance of mutating.",
			input:	{
				type: "number",
				left: {value:0, inclusive:true},
				right: {value:1, inclusive: true}
			}
			, variable: "mutation"
			, init: 0.999

		}
		
	];
	return rules;
}]);

