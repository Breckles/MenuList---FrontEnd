(function(){

	var recipesModule = angular.module('recipesModule', []);


	var recipesController;
	var recipeJustAdded;
	var recipeHasNoIngredients;
	var recipeToViewId;


	///////////////// Directives ////////////////////


	recipesModule.directive('recipes', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/recipes/recipes.html',
			controller: ['$http', '$scope', function($http, $scope) {

				var recipeModel = new recipe();
				
				recipesController = this;
				recipesController.recipes = [];
				recipesController.totalItems = 0;

				recipeModel.fetchIndex($http).then(function(successResponse) {
					recipesController.recipes = successResponse.data.recipes;
					recipesController.totalItems = recipesController.recipes.length;
				}, function(failResponse) {
					console.log("Error fetching recipes index.");
				});

				this.imageRequestUrl = 'http://localhost/MenuList/recipes/image/';

				//pagination implementation
				recipesController.itemsPerPage = 10;
				recipesController.currentPage = 1;

				$scope.setPage = function (pageNo) {
					recipesController.currentPage = pageNo;
				};

				$scope.displayRecipe = function (index) {
					//TODO
				}
			}],
			controllerAs: 'recipesCtrl'
		};
	});	


	///////////////// Controllers ////////////////////////


	recipesModule.controller('RecipesModalCreateCtrl', function($http, $scope, $uibModal) {
		$scope.animationsEnabled = true;

		//calls the open function in the global scope, passes the $uibModal dependancy, as well as a true value for animation
		$scope.open = function() {
			recipeJustAdded = false;
			recipeHasNoIngredients = false;
			// open($uibModal, true, 'html/recipes/recipesModalCreate.html');
			$uibModal.open({
				animation: true,
				templateUrl: 'html/recipes/recipesModalCreate.html',
				controller: 'RecipesModalCreateInstanceCtrl',
				size: 'lg recipeCreateModalDialog', //only way I found to add class to the modal dialog		
			});
		}
	});


	recipesModule.controller('RecipesModalCreateInstanceCtrl', function($http, $scope, $uibModalInstance) {
		
		var fetchUomsIndexUrl = 'http://localhost/MenuList/uoms.json';
		var fetchIngredientsIndexUrl = "http://localhost/MenuList/ingredients.json";

		$scope.recipeIngredientCreateForm;


		$scope.uomsList = [];
		$scope.ingredientsList = [];

		$scope.newRecipe = new recipe();

		$scope.newRecipeIngredient = {
			// recipe_id: -1,
			// ingredient_id: 1,
			// quantity: 1,
			// uom_id: 1,
			// instructions: ''
		};

		$scope.newRecipeIngredients = [];

		//fetch all the available uoms
		$http.get(fetchUomsIndexUrl).success(function(data) {
			$scope.uomsList = data.uoms;
		});

		//fetch all available ingredients
		$http.get(fetchIngredientsIndexUrl).success(function(data) {
			$scope.ingredientsList = data.ingredients;
		});

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.recipeJustAdded = function() {
			return recipeJustAdded;
		};

		$scope.recipeHasNoIngredients = function() {
			return recipeHasNoIngredients;
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


		$scope.submit = function(recipeCreateForm) {	
			recipeHasNoIngredients = false;

			if($scope.newRecipeIngredients.length > 0) {
				//Assign the newRecipeIngredients array to newRecipe.recipe_ingredients
				$scope.newRecipe.recipe_ingredients = $scope.newRecipeIngredients;

				$scope.newRecipe.save($http).then( function(successResponse) {
					//the response includes the newly created recipe along with the proper id
					//add the recipe at the beginning of the recipes array
					recipesController.recipes.unshift(successResponse.data.recipe);

					//update info for pagination and set back to first page
					recipesController.totalItems += 1;
					recipesController.currentPage = 1;

					//will show a flash message to confirm recipe creation
					recipeJustAdded = true;

					//Will clear the forms' fields and clear the list of ingredients so none are displayed
					$scope.newRecipe = new recipe();
					recipeCreateForm.$setPristine();
					$scope.newRecipeIngredient = {};
					$scope.recipeIngredientCreateForm.$setPristine();
					$scope.newRecipeIngredients = [];
				}, 
				function(failResponse) {
					console.log("Error saving the recipe: " + failResponse.status + "\n" + failResponse.statusText);
				});
			}
			else {
				//will make alert show up in form
				recipeHasNoIngredients = true;
			}

		};
	});


	recipesModule.controller('RecipesModalViewCtrl', function($scope, $uibModal) {
		$scope.animationsEnabled = true;

		//calls the open function in the global scope, passes the $uibModal dependancy, as well as a true value for animation
		$scope.open = function(recipeId) {
			$uibModal.open({
				animation: true,
				templateUrl: 'html/recipes/recipesModalView.html',
				controller: 'RecipesModalViewInstanceCtrl',
				size: 'lg', //only way I found to add class to the modal dialog	
				resolve: {
					recipeId: recipeId
				}						
			});
		};
	});

	recipesModule.controller('RecipesModalViewInstanceCtrl', function($http, $scope, $uibModalInstance, recipeId) {

		var recipeModel = new recipe();

		recipeModel.fetchRecipe($http, recipeId).then(function(successResponse) {
			$scope.recipe = successResponse.data.recipe;
			$scope.imageLink = 'http://localhost/MenuList/recipes/image/' + $scope.recipe.image;
		}, function(failResponse) {
			console.log(failResponse.status + "\n" + failResponse.statusText);
		});

		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		};
	});
})();