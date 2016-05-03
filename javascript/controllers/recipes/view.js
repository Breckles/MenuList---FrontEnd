(function() {

	angular.module('AppModule').controller('RecipesViewController', function($http, $scope, $routeParams, AlertService) {

		//Hide any previous alerts
		AlertService.hidePageAlert();

		var recipeInterface = new RecipeInterface();
		var recipeId = $routeParams.id;

		recipeInterface.fetchForView($http, recipeId).then(function(successResponse) {
			$scope.recipe = successResponse.data.recipe;
			$scope.imageLink = 'http://localhost/MenuList/recipes/image/' + $scope.recipe.image;
		}, function(failResponse) {
			console.log(failResponse.status + "\n" + failResponse.statusText);
		});

	});

})();