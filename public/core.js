var cosmoApp = angular.module('cosmoApp', []);

cosmoApp.controller('WorldController', ['$scope',"$http",
function($scope,$http){
	$scope.formData = {};
	$scope.currentSimulation = {};

	$scope.pickFirstSim = function()
	{
		if($scope.sims.length>0){
			$scope.currentSimulation = $scope.sims[0];
		}
		else{
			$scope.currentSimulation = {};
		}
	};

	$scope.pickLastSim = function(){
		if($scope.sims.length>0){
			$scope.currentSimulation = $scope.sims[$scope.sims.length-1];
		}
		else{
			$scope.currentSimulation = {};
		}
	};

	$scope.pickSim = function(sim)
	{
		$scope.currentSimulation = sim;
	};

	$scope.getSims = function()
	{
		$http.get('/apis/worlds')
			.success(function(data){
				$scope.sims = data;
			})
			.error(function(data)
			{
				console.log('Cannot find simulations.');
			});
	};

	$scope.createSim = function()
	{
		console.log("Attempting to create " + $scope.formData.name);

		$http.post('/apis/worlds', $scope.formData)
			.success(function(data){
				$scope.formData = {};
				$scope.randomName();
				$scope.sims = data;
				$scope.pickLastSim();
			})
			.error(function(data)
			{
				console.log('Create sim error: ' + data);
			});
	};
	$scope.deleteSim = function(id) 
	{
		console.log("Attempting to delete " + id);

		$http.delete('/apis/worlds/' + id)
			.success(function(data)
			{
				$scope.sims = data;
				$scope.pickFirstSim();
			})	
			.error(function(data)
			{
				console.log('Delete sim error: ' + data);
			
			});		
	};

	$scope.getCurrentOfWorld = function(name)
	{
		$http.get('/apis/worlds/current-world-data/' + name)
			.success(function(data)
			{

			})
			.error(function(data)
			{
				console.log('Get snapshot error: ' + data);
			});
	};

	$scope.getSimAtDate= function(name,month,day,year)
	{
		$http.get('/apis/worlds/world-data/' + name + '/'+ month + '/'+ day + '/'+ year)
			.success(function(data)
			{
				console.log(data);
			})
			.error(function(data)
			{
				console.log('Get snapshot error: ' + data);
			});
	};

	$scope.deleteSims = function()
	{
		console.log('Attempting to delete all sims.');

		$http.delete('/apis/worlds/' + id)
			.success(function(data)
			{
				$scope.sims = data;
				$scope.pickFirstSim();
			})	
			.error(function(data)
			{
				console.log('Delete sim error: ' + data);
			
			});	
	};

	$scope.startApp = function(){
		$http.get('/apis/worlds')
			.success(function(data){
				$scope.sims = data;
				
				$scope.pickFirstSim();
			})
			.error(function(data)
			{
				console.log('Cannot find simulations.');
			});
	};

	$scope.startSimulation = function(sim)
	{
		$http.post('/apis/worlds/start/' + sim.name)
		.success(function(){

		})
		.error(function(){

		});
	};
	
	$scope.generateName = function()
	{
		var name = "";
        for (var i = 0; i < 6; i++)
        {
            if (i % 2 == 0)//We want a consonant
            {
                var index = 0;

                //If you found a vowel keep looking
                while (index == 0 || index == 4 || index == 8 || index == 14 || index == 20)
                {
                    index = Math.floor(Math.random() * 26);  
                }

                //We found our consonant
                var next_letter = String.fromCharCode(97 + index);

                //Add the character
                name += next_letter;

                //If its a q add the u
                if (next_letter == 'q')
                {
                    name += "u";
                }
            }
            else//We are looking for a vowel
            {
                var index = 1;

                //If you found a vowel keep looking
                while (index != 0 && index != 4 && index != 8 && index != 14 && index != 20)
                {
                    index = Math.floor(Math.random() * 26);
                }

                var next_letter = String.fromCharCode(97 + index);

                //Add the character
                name += next_letter;
            }
        }
        return name.charAt(0).toUpperCase() + name.slice(1);
	};

	$scope.randomName = function()
	{
		$scope.formData.name = $scope.generateName();
	};
	
	$scope.startApp();
	$scope.randomName();
}]);