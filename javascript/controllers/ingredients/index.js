(function() {

	angular.module('AppModule').controller('IngredientsIndexController', ['$http', '$scope', 'AlertService', function($http, $scope, AlertService) {
					
		var ingredientInterface = new IngredientInterface();
		$scope.ingredients = [];

		//values required for pagination
		$scope.itemsPerPage = 10;
		$scope.currentPage = 1;
		$scope.totalItems = 0;

		ingredientInterface.fetchIndex($http).then(function(successResponse){
			$scope.ingredients = successResponse.data.ingredients;
			$scope.totalItems = $scope.ingredients.length;
		}, function(failResponse) {
			console.log("Error fetching ingredients index: " + failResponse.status + "\n" + failResponse.statusText);
		});


		$scope.imageRequestUrl = 'http://localhost/MenuList/ingredients/image/';		

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.deleteIngredient = function(ingredientId, index) {
	  		var deleteIngredient = confirm('Are you sure you want to delete this ingredient?');

	  		if(deleteIngredient) {
	  			//Need to make sure the index takes pagination into account
	  			var removeIndex = index + (($scope.currentPage - 1) * $scope.itemsPerPage);

	  			var ingredientInterface = new IngredientInterface();
	  			ingredientInterface.delete($http, ingredientId).then(function(successResponse) {
	  				//Remove the ingredient from the array
	  				$scope.ingredients.splice(removeIndex, 1);

	  				//Update pagination info
	  				$scope.totalItems -= 1;

	  				AlertService.showPageAlert('alert-success', 'The ingredient has been deleted');
	  			}, function(failResponse) {
	  				console.log(failResponse.status + "\n" + failResponse.statusText);
	  			});
	  		}
	  	};

	}]);

})();