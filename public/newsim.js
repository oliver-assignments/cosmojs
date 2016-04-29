var cosmoApp = angular.module('cosmoApp', []);

cosmoApp.controller('NewSimController', ['$scope',"$http",
function($scope,$http) {
	
	$scope.formData={
		metabolism: true
	};
	$scope.biomassDisabled = false;


	$scope.createSim = function()
	{
		$http.post('/apis/worlds', $scope.formData)
			.success(function(data) {

				$scope.fillNameBlank();
				$scope.sims = data;
				$scope.pickSim($scope.formData.name);
				$scope.formData = {};
			})
			.error(function(data)
			{
				console.log('Create sim error: ' + data);
			});
	};
	
	//$('button').prop('disabled', true);

	$scope.fillNameBlank = function()
	{
		$http.get('/apis/utility/name/generate')
			.success(function(data)
			{
				$scope.formData.name = data;
			})	
			.error(function(data)
			{
				console.log('Generate name error: ' + data);
			
			});	
	};
	$scope.getSimulationRules = function()
	{
		var rules = "";
		
		if($scope.formData.metabolism)
		{
			rules += "M, ";			
		}
		if($scope.formData.starvation)
		{
			rules += "Q, ";			
		}
		if($scope.formData.waterStorage)
		{
			rules += "W, ";			
		}
		if($scope.formData.nutrientDiffusion)
		{
			rules += "N, ";			
		}
		if($scope.formData.maturity)
		{
			rules += "G, ";			
		}
		if($scope.formData.disease)
		{
			rules += "D, ";			
		}
		
		if($scope.isValidNumber($scope.formData.neighbors)) {
				rules += "R ("+$scope.formData.neighbors+"), ";			
			
		}

		if($scope.isValidNumber($scope.formData.mutation)) {
			rules += "S ("+$scope.formData.mutation+"), ";			
		
		}
		if($scope.isValidNumber($scope.formData.neighbors) || 
			$scope.isValidNumber($scope.formData.disease) || 
			$scope.isValidNumber($scope.formData.starvation))
		{
			$scope.biomassDisabled = false;	

			if($scope.isValidNumber($scope.formData.biomassEndowment))
			{
				rules += "B (" + $scope.formData.biomassEndowment+"), ";
			}
		}
		else
		{
			$scope.biomassDisabled = true;
		}
			
		for (var i in $scope.formData) {
		  if ($scope.formData[i] === null ||$scope.formData[i] === "" || $scope.formData[i] === undefined) {
		  // test[i] === undefined is probably not very useful here
		    delete $scope.formData[i];
		  }
		}
		console.log($scope.formData);

		rules = rules.substring(0, rules.length - 2);
		return rules;
	};
	$scope.isValidNumber = function(n)
	{
		return n != null &&
			n != "" && !isNaN(n);
	};
	$scope.startForm = function()
	{
		$scope.fillNameBlank();
	};
	$scope.startForm();
}]);

