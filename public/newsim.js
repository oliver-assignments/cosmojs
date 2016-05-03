angular.module('newSimulationApp', ['ngAnimate','ui.bootstrap', 'rulesApp'])
.controller('newSimController', ['$scope',"$http",'rulesService',
function($scope,$http, rulesService) 
{
	$scope.rules = rulesService;

	$scope.formData={
		name: "",
		metabolism: true,
		rotation: 1,
		tilt: 0.75,
		dimensions:{columns:80,rows:50},
		rules:[]
	};

	$scope.createSim = function()
	{
		$http.post('/apis/worlds', $scope.formData)
			.success(function(data) {
				//$window.location.href = '/worlds/' + $scope.formData.name;
			})
			.error(function(data)
			{
				console.log('Create sim error: ' + data);
			});
	};
	
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
	
	$scope.startForm = function()
	{
		$scope.fillNameBlank();
	};
	$scope.getValue = function(name)
	{
		return "formData." + name
	};
	$scope.startForm();

}]);

// for (var i in $scope.formData) {
	//   if ($scope.formData[i] === null ||$scope.formData[i] === "" || $scope.formData[i] === undefined || $scope.formData[i] == false) {
	//     delete $scope.formData[i];
	//   }
	// }
	// $scope.isValidNumber = function(n)
	// {
	// 	return n != null &&
	// 		n != "" && !isNaN(n);
	// };