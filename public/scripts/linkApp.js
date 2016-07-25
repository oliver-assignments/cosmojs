angular.module('linkApp', ['ngAnimate'])

.factory('linkService',[
function()
{
	var linkService = {};
	linkService.links = 
	[
		{
			name:"Twitter"
			, url: "https://www/twitter.com/capsandhammers"
			, image: "./images/twitter.png"
		}
		,{
			name:"Facebook"
			, url: "https://www.facebook.com/capsandhammers"
			, image: "./images/fb.png"
		}
		,{
			name:"Board Game Geek"
			, url: "https://boardgamegeek.com/boardgame/189865/caps-hammers-particularly-cold-war"
			, image: "./images/bgg.png"
		}
	];

	return linkService;
}])
.controller('linkController',['$scope', 'linkService',
function($scope,linkService)
{
	$scope.links = linkService.links;
}]);