(function() {

	angular.module('AppModule').controller('RecipesCreateController', ['$http', '$scope', '$location', 'AlertService', function($http, $scope, $location, AlertService) {

		var uomInterface = new UomInterface();
		var ingredientInterface = new IngredientInterface();

		AlertService.hidePageAlert();

		$scope.recipeIngredientCreateForm;


		$scope.uomsList = [];
		$scope.ingredientsList = [];

		$scope.newRecipe = new Recipe();
		$scope.recipesInterface = new RecipeInterface();

		$scope.newRecipeIngredient = new RecipeIngredient();

		$scope.newRecipeIngredients = [];

		//fetch all the available uoms
		uomInterface.fetchIndex($http).then(function(successResponse) {
			$scope.uomsList = successResponse.data.uoms;
		}, function(failResponse) {
			console.log("Error fetching Uoms Index\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

		//fetch all available ingredients
		ingredientInterface.fetchIndex($http).then(function(successResponse) {
			$scope.ingredientsList = successResponse.data.ingredients;
		}, function(failResponse) {
			console.log("Error fetching Ingredients Index\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.addRecipeIngredient = function(recipeIngredientCreateForm) {
			$scope.newRecipeIngredients.push($scope.newRecipeIngredient);
			$scope.newRecipeIngredient = {};
			recipeIngredientCreateForm.$setPristine();
			$scope.recipeIngredientCreateForm = recipeIngredientCreateForm;//keep a reference to the form controller so we can set the recipeIngredients form to pristine when a recipe is saved
		};

		$scope.isNewRecipeIngredientsEmpty = function() {
			return $scope.newRecipeIngredients.length === 0;
		};


		$scope.createRecipe = function() {

			if($scope.newRecipeIngredients.length > 0) {
				//Assign the newRecipeIngredients array to newRecipe.recipe_ingredients
				$scope.newRecipe.recipe_ingredients = $scope.newRecipeIngredients;

				$scope.recipesInterface.create($http, $scope.newRecipe).then( function(successResponse) {
					AlertService.showPageAlert('alert-success', 'The recipe has been created.');
					//Redirect to recipes index
					$location.path('/recipes');
				}, 
				function(failResponse) {
					console.log("Error saving the recipe: " + failResponse.status + "\n" + failResponse.statusText);
				});
			}
			else {
				AlertService.showPageAlert('alert-danger', 'The recipe must have at least 1 ingredient');
			}
		};

	}]);



})();