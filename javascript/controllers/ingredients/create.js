(function() {
	angular.module('AppModule').controller('IngredientsCreateController', ['$http', '$scope', '$location', 'AlertService',
	  function($http, $scope, $location, AlertService) {

	  	$scope.ingredientInterface = new IngredientInterface();
	  	$scope.newIngredient = new Ingredient();
	  	$scope.categoriesList = [];

	  	//fetch the categories
	  	$http.get('http://localhost/MenuList/categories.json').then(function(successResponse) {
	  		$scope.categoriesList = successResponse.data.categories;
	  	}, function(failResponse) {
	  		console.log(failResponse.status + "\n" + failResponse.statusText);
	  	});

		$scope.createIngredient = function() {
			console.log($scope.newIngredient);

			$scope.ingredientInterface.create($http, $scope.newIngredient).then(function(successResponse) {
				AlertService.showPageAlert('alert-success', 'The ingredient has been created.');
				$location.path('/ingredients');
			}, function(failResponse) {
				console.log(failResponse.status + "\n" + failResponse.statusText);
			});
		};
	}]);
})();