(function(){

	var recipesModule = angular.module('RecipesModule', []);


	var recipesController;
	var recipeToViewId;

	var alertMessage = '';


	///////////////// Directives ////////////////////


	recipesModule.directive('recipes', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/recipes/recipes.html',
			controller: ['$http', '$scope', function($http, $scope) {

				var recipesInterface = new RecipesInterface();
				
				recipesController = this;
				recipesController.recipes = [];
				recipesController.totalItems = 0;

				recipesInterface.fetchIndex($http).then(function(successResponse) {
					recipesController.recipes = successResponse.data.recipes;
					recipesController.totalItems = recipesController.recipes.length;
				}, function(failResponse) {
					console.log("Error fetching recipes index.");
				});

				this.imageRequestUrl = 'http://localhost/MenuList/recipes/image/';

				//pagination implementation
				recipesController.itemsPerPage = 10;
				recipesController.currentPage = 1;

				$scope.setPage = function(pageNo) {
					recipesController.currentPage = pageNo;
				};
			}],
			controllerAs: 'recipesCtrl'
		};
	});	


	///////////////// Controllers ////////////////////////

	recipesModule.controller('RecipesActionsCtrl', ['$http', '$scope', '$uibModal', 'AlertService', function($http, $scope, $uibModal, AlertService) {
		$scope.openRecipeViewModal = function(recipeId) {
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

		$scope.openRecipeCreateModal = function() {
			$scope.alertService.hideModalAlert();

			$uibModal.open({
				animation: true,
				templateUrl: 'html/recipes/recipesModalCreate.html',
				controller: 'RecipesModalCreateInstanceCtrl',
				size: 'lg recipeCreateModalDialog', //only way I found to add class to the modal dialog		
			});
		};

		$scope.openRecipeEditModal = function(recipeId, recipeIndex) {
			console.log('Recipe ID: ' + recipeId + ' Recipe Index: ' + recipeIndex);
			$uibModal.open({
				animation: true,
				templateUrl: 'html/recipes/recipesModalEdit.html',
				controller: 'RecipesModalEditInstanceCtrl',
				size: 'lg',
				resolve: {
					recipeId: recipeId,
					recipeIndex: recipeIndex + ((recipesController.currentPage - 1) * recipesController.itemsPerPage)
					
				}	
			});
		};

		$scope.deleteRecipe = function(recipeId, index) {
			//Hide any previous alerts
			$scope.alertService.hidePageAlert();

			var deleteRecipe = confirm('Are you sure you want to delete this recipe?');

			if(deleteRecipe) {
				//Pagination messes with indexes, we need to account for this
				var removeIndex = index + ((recipesController.currentPage - 1) * recipesController.itemsPerPage);

				var recipesInterface = new RecipesInterface();
				recipesInterface.delete($http, recipeId).then(function(successResponse) {
					console.log(index);
					//Remove the recipe from the array
					recipesController.recipes.splice(removeIndex, 1);

					//Update pagination info
					recipesController.totalItems -= 1;
					AlertService.showPageAlert('alert-success', 'The recipe has been deleted');
				}, function(failResponse) {
					console.log("Error deleting the recipe: " + failResponse.status + "\n" + failResponse.statusText);
				});
			}
		};
	}]);


	recipesModule.controller('RecipesModalCreateInstanceCtrl', ['$http', '$scope', '$uibModalInstance', 'AlertService',
	  function($http, $scope, $uibModalInstance, AlertService) {

	  	$scope.alertService = AlertService;
		
		var uomsInterface = new UomsInterface();
		var ingredientsInterface = new IngredientsInterface();

		$scope.alertService.hideModalAlert();

		$scope.recipeIngredientCreateForm;


		$scope.uomsList = [];
		$scope.ingredientsList = [];

		$scope.newRecipe = new Recipe();
		$scope.recipesInterface = new RecipesInterface();

		$scope.newRecipeIngredient = new RecipeIngredient();

		$scope.newRecipeIngredients = [];

		//fetch all the available uoms
		uomsInterface.fetchIndex($http).then(function(successResponse) {
			$scope.uomsList = successResponse.data.uoms;
		}, function(failResponse) {
			console.log("Error fetching Uoms Index\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

		//fetch all available ingredients
		ingredientsInterface.fetchIndex($http).then(function(successResponse) {
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


		$scope.submit = function(recipeCreateForm) {	
			$scope.alertService.hideModalAlert();

			if($scope.newRecipeIngredients.length > 0) {
				//Assign the newRecipeIngredients array to newRecipe.recipe_ingredients
				$scope.newRecipe.recipe_ingredients = $scope.newRecipeIngredients;

				$scope.recipesInterface.create($http, $scope.newRecipe).then( function(successResponse) {
					//the response includes the newly created recipe along with the proper id
					//add the recipe at the beginning of the recipes array
					recipesController.recipes.unshift(successResponse.data.recipe);

					//update info for pagination and set back to first page
					recipesController.totalItems += 1;
					recipesController.currentPage = 1;

					$scope.alertService.showModalAlert('alert-success', 'The recipe has been created.');

					//Will clear the forms' fields and clear the list of ingredients so none are displayed
					$scope.newRecipe = new Recipe();
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
				$scope.alertService.showModalAlert('alert-danger', 'The recipe must have at least 1 ingredient');
			}
		};
	}]);



	recipesModule.controller('RecipesModalViewInstanceCtrl', function($http, $scope, $uibModalInstance, recipeId) {

		var recipesInterface = new RecipesInterface();

		recipesInterface.fetchForView($http, recipeId).then(function(successResponse) {
			$scope.recipe = successResponse.data.recipe;
			$scope.imageLink = 'http://localhost/MenuList/recipes/image/' + $scope.recipe.image;
		}, function(failResponse) {
			console.log(failResponse.status + "\n" + failResponse.statusText);
		});

		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		};
	});



	recipesModule.controller('RecipesModalEditInstanceCtrl', ['$http', '$scope', '$uibModalInstance', 'AlertService', 'recipeId', 'recipeIndex',
	  function($http, $scope, $uibModalInstance, AlertService, recipeId, recipeIndex) {
		//////////// declarations /////////////
		$scope.alertService = AlertService;
		$scope.alertService.hideModalAlert();//Make sure no previous alerts show up

		var recipesInterface = new RecipesInterface();
		var recipeIngredientsInterface = new RecipeIngredientsInterface();
		var uomsInterface = new UomsInterface();
		var ingredientsInterface = new IngredientsInterface();

		$scope.newRecipeIngredient = new RecipeIngredient();

		var currentPanel = 0;

		///////////// fetching ///////////////

		recipesInterface.fetchForEdit($http, recipeId).then(function(successResponse) {
			$scope.recipe = successResponse.data.recipe;
		}, function(failResponse) {
			console.log("Error fetching Recipe for Edit\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

		recipeIngredientsInterface.fetchForEdit($http, recipeId).then(function(successResponse) {
			console.log(successResponse.data.recipeIngredients);
			$scope.recipeIngredients = successResponse.data.recipeIngredients;

			$scope.currentRecipeIngredient = $scope.recipeIngredients[0];
		}, function(failResponse) {
			console.log("Error fetching RecipeIngredients for Edit\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

		//fetch all the available uoms
		uomsInterface.fetchIndex($http).then(function(successResponse) {
			$scope.uomsList = successResponse.data.uoms;
		}, function(failResponse) {
			console.log("Error fetching Uoms Index\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

		//fetch all available ingredients
		ingredientsInterface.fetchIndex($http).then(function(successResponse) {
			$scope.ingredientsList = successResponse.data.ingredients;
		}, function(failResponse) {
			console.log("Error fetching Ingredients Index\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});


		///////////// functions ////////////////

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.isPanelSelected = function(panel) {
			return panel == currentPanel;
		};

		$scope.selectPanel = function(panel) {
			$scope.alertService.hideModalAlert();
			currentPanel = panel;

			$scope.currentRecipeIngredient = $scope.recipeIngredients[panel];
		};

		

		$scope.updateRecipe = function() {	
			$scope.alertService.hideModalAlert();

			recipesInterface.update($http, $scope.recipe).then(function(successResponse) {
				$scope.alertService.showModalAlert('alert-success', 'The recipe has been updated');
				recipesController.recipes[recipeIndex] = $scope.recipe;
			}, function(failResponse) {
				console.log(failResponse.status + "\n" + failResponse.statusText);
			});
		};

		$scope.updateRecipeIngredient = function() {
			$scope.alertService.hideModalAlert();

			//If the recipeIngredient.uom was changed, the recipeIngredient.uom_id must reflect the new uom
			$scope.currentRecipeIngredient.uom_id =  $scope.currentRecipeIngredient.uom.id;

			recipeIngredientsInterface.update($http, $scope.currentRecipeIngredient).then(function(successResponse) {
				$scope.alertService.showModalAlert('alert-success', 'The recipe ingredient has been updated.');
			}, function(failResponse) {
				console.log(failResponse.status + "\n" + failResponse.statusText);
			});
		}

		$scope.addRecipeIngredient = function(recipeIngredientCreateForm) {		
			$scope.alertService.hideModalAlert();

			//RecipeIngredient needs the recipeId for the recipe being edited
			$scope.newRecipeIngredient.recipe_id = $scope.recipe.id;
			console.log($scope.newRecipeIngredient);

			recipeIngredientsInterface.create($http, $scope.newRecipeIngredient).then(function(successResponse) {
				$scope.recipeIngredients = successResponse.data.recipeIngredients;
				$scope.newRecipeIngredient = new RecipeIngredient();
				recipeIngredientCreateForm.$setPristine();
				$scope.alertService.showModalAlert('alert-success', 'The recipe ingredient has been added');
			}, function(failResponse) {
				console.log(failResponse.status + "\n" + failResponse.statusText);
			});
		};

		$scope.deleteRecipeIngredient = function(recipeIngredientId) {

			if($scope.recipeIngredients.length > 1) {
				var deleteRecipeIngredient = confirm('Are you sure you want to delete this recipe ingredient?');

				if(deleteRecipeIngredient) {
					recipeIngredientsInterface.delete($http, recipeIngredientId).then(function(successResponse) {
						currentPanel = 0;
						$scope.recipeIngredients = successResponse.data.recipeIngredients;					
						$scope.alertService.showModalAlert('alert-success', 'The recipe Ingredient has been deleted.');
					}, function(failResponse) {
						console.log("Error deleting RecipeIngrdeient\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
					});
				}
			}
			else {
				//A recipe with no ingredients makes no sense, so we warn the user
				$scope.alertService.showModalAlert('alert-danger', 'A recipe must have at least 1 ingredient.');
			}
			
		};
	}]);
})();