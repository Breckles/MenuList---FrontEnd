(function() {

	angular.module('AppModule').controller('RecipesEditController', ['$http', '$scope', '$routeParams', 'AlertService', function($http, $scope, $routeParams, AlertService) {

		//Hide any previous alerts
		AlertService.hidePageAlert();

		var recipeInterface = new RecipeInterface();
		var recipeIngredientInterface = new RecipeIngredientInterface();
		var uomInterface = new UomInterface();
		var ingredientInterface = new IngredientInterface();
		var recipeId = $routeParams.id;
		var currentPanel = 0;

		$scope.newRecipeIngredient = new RecipeIngredient();

		///////////// fetching ///////////////

		recipeInterface.fetchForEdit($http, recipeId).then(function(successResponse) {
			$scope.recipe = successResponse.data.recipe;
		}, function(failResponse) {
			console.log("Error fetching Recipe for Edit\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

		recipeIngredientInterface.fetchForEdit($http, recipeId).then(function(successResponse) {
			$scope.recipeIngredients = successResponse.data.recipeIngredients;
			$scope.currentRecipeIngredient = $scope.recipeIngredients[0];
		}, function(failResponse) {
			console.log("Error fetching RecipeIngredients for Edit\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

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

		///////////// functions ////////////////

		$scope.isPanelSelected = function(panel) {
			return panel == currentPanel;
		};

		$scope.selectPanel = function(panel) {
			currentPanel = panel;

			$scope.currentRecipeIngredient = $scope.recipeIngredients[panel];
		};

		

		$scope.updateRecipe = function() {	

			recipeInterface.update($http, $scope.recipe).then(function(successResponse) {
				AlertService.showPageAlert('alert-success', 'The recipe has been updated');
			}, function(failResponse) {
				console.log(failResponse.status + "\n" + failResponse.statusText);
			});
		};

		$scope.updateRecipeIngredient = function() {

			//If the recipeIngredient.uom was changed, the recipeIngredient.uom_id must reflect the new uom
			$scope.currentRecipeIngredient.uom_id =  $scope.currentRecipeIngredient.uom.id;

			recipeIngredientInterface.update($http, $scope.currentRecipeIngredient).then(function(successResponse) {
				AlertService.showPageAlert('alert-success', 'The recipe ingredient has been updated.');
			}, function(failResponse) {
				console.log(failResponse.status + "\n" + failResponse.statusText);
			});
		}

		$scope.addRecipeIngredient = function(recipeIngredientCreateForm) {	

			//RecipeIngredient needs the recipeId for the recipe being edited
			$scope.newRecipeIngredient.recipe_id = $scope.recipe.id;
			console.log($scope.newRecipeIngredient);

			recipeIngredientInterface.create($http, $scope.newRecipeIngredient).then(function(successResponse) {
				$scope.recipeIngredients = successResponse.data.recipeIngredients;
				$scope.newRecipeIngredient = new RecipeIngredient();
				recipeIngredientCreateForm.$setPristine();
				AlertService.showPageAlert('alert-success', 'The recipe ingredient has been added');
			}, function(failResponse) {
				console.log(failResponse.status + "\n" + failResponse.statusText);
			});
		};

		$scope.deleteRecipeIngredient = function(recipeIngredientId) {

			if($scope.recipeIngredients.length > 1) {
				var deleteRecipeIngredient = confirm('Are you sure you want to delete this recipe ingredient?');

				if(deleteRecipeIngredient) {
					recipeIngredientInterface.delete($http, recipeIngredientId).then(function(successResponse) {
						currentPanel = 0;
						$scope.recipeIngredients = successResponse.data.recipeIngredients;
						$scope.currentRecipeIngredient = $scope.recipeIngredients[currentPanel];					
						AlertService.showPageAlert('alert-success', 'The recipe Ingredient has been deleted.');
					}, function(failResponse) {
						console.log("Error deleting RecipeIngrdeient\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
					});
				}
			}
			else {
				//A recipe with no ingredients makes no sense, so we warn the user
				AlertService.showPageAlert('alert-danger', 'A recipe must have at least 1 ingredient.');
			}
			
		};

	}]);

})();

