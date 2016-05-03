angular.module('rulesApp',[])
.factory('rulesService', [
function()
{
	var rules = {};
	rules.booleanRules = 
	[
		{
			character: "C",
			title: "Consumption",
			tooltip: "Plants consume nutrients from the soil equal to their metabolism."
		},
		{
			character: "V",
			title: "Starvation",
			tooltip: "Plants die if their nutrient/water stores reach zero."
		},
		{
			character: "W",
			title: "Water Consumption and Storage",
			tooltip: "Plants recieve and store water from rainfall, and need it to survive."
		},
		{
			character: "A",
			title: "Nutrient Averaging",
			tooltip: "Periodically average local soil nutrients."
		},
		{
			character: "M",
			required: "S",
			title: "Maturity",
			tooltip: "Plants must mature before they can reproduce. Requires seeding."
		},
		{
			character: "D",
			title: "Disease",
			tooltip: "Disease infects and kills plants."
		},
		{
			character: "B",
			title: "Biomass Decay",
			required: "R | D | V",
			tooltip: "Plants deposit their endowment into the soil upon death. Requires a mode of death."
			
		}
	];
	rules.inputRules = 
	[
		{
			character: "R",
			title: "Root Competition",
			tooltip: "Plants die if they have too many neighbors n.",
			inputs:[
				{
					character: "n",
					type:"int",
					title: "neighbors",
					left: {value:1, inclusive: true},
					right: {value:9, inclusive: true}
				},
				{
					character: "n",
					type:"int",
					title: "neighbors",
					left: {value:1, inclusive: true},
					right: {value:9, inclusive: true}
				}]
		},
		{
			character: "S",
			title: "Seeding",
			tooltip: "Plants reproduce if they have stored their nutrient endowment.",
			inputs:[
				{
					character: "m",
					title: "chromosomal mutation rate",
					type: "float",
					left: {value:0, inclusive:true},
					right: {value:1, inclusive: true}
				}]
		}
		
	];
	rules.GetInputString = function(input)
	{

		var string = "";
		if(input.type !=null)
		{
			string+= input.type + " ";
		}
		string += input.title + " " + input.character + " ";

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
	return rules;
}]);

