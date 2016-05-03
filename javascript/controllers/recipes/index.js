(function() {

	angular.module('AppModule').controller('RecipesIndexController', 
	  ['$http', '$scope', '$rootScope', 'AlertService', function($http, $scope, $rootScope, AlertService) {

		var recipeInterface = new RecipeInterface();				
			
		$scope.recipes = [];
		$scope.totalItems = 0;
		$scope.itemsPerPage = 10;

		recipeInterface.fetchIndex($http).then(function(successResponse) {
			$scope.recipes = successResponse.data.recipes;
			$scope.totalItems = $scope.recipes.length;

			//If $rootScope.trackRecipesPage is undefined, then it is the first time we are loading the recipes index,
			//and we set the current page to 1
			//If it is defined, then the user is returning to the index from a previous action (probably viewing a recipe),
			//so we set the current page to what it was before the user navigated away
			if(typeof $rootScope.trackRecipesPage === 'undefined') {
				$rootScope.trackRecipesPage = 1;				
			}
			$scope.currentPage = $rootScope.trackRecipesPage;
		}, function(failResponse) {
			console.log("Error fetching recipes index: " + failResponse.status + "\n" + failResponse.statusText);
		});

		$scope.imageRequestUrl = 'http://localhost/MenuList/recipes/image/';				

		$scope.updateTrackRecipesPage = function() {
			$rootScope.trackRecipesPage = $scope.currentPage;
		};

		$scope.deleteRecipe = function(recipeId, index) {

			var deleteRecipe = confirm('Are you sure you want to delete this recipe?');

			if(deleteRecipe) {
				//Pagination messes with indexes, we need to account for this
				var removeIndex = index + (($scope.currentPage - 1) * $scope.itemsPerPage);

				var recipeInterface = new RecipeInterface();
				recipeInterface.delete($http, recipeId).then(function(successResponse) {
					console.log(index);
					//Remove the recipe from the array
					$scope.recipes.splice(removeIndex, 1);

					//Update pagination info
					$scope.totalItems -= 1;
					AlertService.showPageAlert('alert-success', 'The recipe has been deleted');
				}, function(failResponse) {
					console.log("Error deleting the recipe: " + failResponse.status + "\n" + failResponse.statusText);
				});
			}
		};

	}]);

})();

