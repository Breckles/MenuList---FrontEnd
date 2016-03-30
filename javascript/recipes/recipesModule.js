(function(){

	var recipesModule = angular.module('recipesModule', []);


	var recipesController;
	var recipeJustAdded;
	var recipeHasNoIngredients;
	var recipeToViewId;

	//function to open the modal
	//@uibModal : The uibModal service dependancy
	//@animationsEnabled : true/false for modal opening animation
	//@template : The HTML content of the modal
	var open = function(uibModal, animationsEnabled, template) {
		console.log('Opening');
		var modalInstance = uibModal.open({
			animation: animationsEnabled,
			templateUrl: template,
			controller: 'RecipesModalCreateInstanceCtrl',
			size: 'lg recipeCreateModalDialog', //only way I found to add class to the modal dialog
			// windowClass: 'recipeCreateModal', 
			resolve: {
				'uibModal': uibModal
			}			
		});
	};


	///////////////// Directives ////////////////////


	recipesModule.directive('recipes', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/recipes/recipes.html',
			controller: ['$http', '$scope', function($http, $scope) {
				
				recipesController = this;
				recipesController.recipes = [];

				recipesController.totalItems = 0;

				var fetchRecipesIndexUrl = 'http://localhost/MenuList/recipes.json';

				$http.get(fetchRecipesIndexUrl).success(function(data){
					console.log(data.recipes[0]);
					recipesController.recipes = data.recipes;
					recipesController.totalItems = recipesController.recipes.length;
					console.log(recipesController.recipes.length);
				});


				this.imageRequestUrl = 'http://localhost/MenuList/recipes/image/';

				//pagination implementation
				recipesController.itemsPerPage = 10;
				recipesController.currentPage = 1;

				$scope.setPage = function (pageNo) {
					recipesController.currentPage = pageNo;
				};

				$scope.displayRecipe = function (index) {

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
			open($uibModal, true, 'html/recipes/recipesModalCreate.html');
		}
	});


	recipesModule.controller('RecipesModalCreateInstanceCtrl', function($http, $scope, $uibModalInstance, uibModal) {
		
		var fetchUomsIndexUrl = 'http://localhost/MenuList/uoms.json';
		var fetchIngredientsIndexUrl = "http://localhost/MenuList/ingredients.json";


		$scope.uomsList = [];
		$scope.ingredientsList = [];

		$scope.newRecipe = {
			user_id: 1,
			description: '',
			instructions: '',
			image: '',
			private: true,
			recipe_ingredients: []
		};

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
		

		//as the recipe is being created, the entered values will be kept in this variable. The 'private' property is controlled by a checkbox,
		//so I must initialize its value to make sure it is sent in the request (otherwise, if the user does not interact with the checkbox,
		//the 'private' property never gets initialized, which results in a failure to save the recipe in the back-end). Since 'true' is the default value in the back-end, I set the same default value here
		// $scope.newRecipe = {
		// 	user_id: 1, //this is for convenience until I implement users
		// 	private: true
		// };

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.recipeJustAdded = function() {
			return recipeJustAdded;
		};

		$scope.recipeHasNoIngredients = function() {
			return recipeHasNoIngredients;
		};


		$scope.addRecipeIngredient = function() {
			$scope.newRecipeIngredients.push($scope.newRecipeIngredient);
			$scope.newRecipeIngredient = {};
		};

		$scope.isNewRecipeIngredientsEmpty = function() {
			return $scope.newRecipeIngredients.length === 0;
		};


		//this is messed up and I will have to find a different way to do things and implement best practice.
		//essentially, the function makes the post request to create a new recipe. Upon success, it creates another 
		//modal (without animation) with the response body, then closes the first one. This causes an unpleasant flicker on the screen.
		//I did this because I could not find a way to simply swap the template for the existing modal.
		$scope.submit = function() {	
			recipeHasNoIngredients = false;

			if($scope.newRecipeIngredients.length > 0) {
				//The recipeIngredientsList elements must be formatted so that ingredient_id and uom_id have the proper id values, rather than the ingredient and uom objects
				for(var i = 0; i < $scope.newRecipeIngredients.length; i++)
				{
					console.log($scope.newRecipeIngredients[i]);
					$scope.newRecipeIngredients[i].uom_id = $scope.newRecipeIngredients[i].uom_id.id;
					$scope.newRecipeIngredients[i].ingredient_id = $scope.newRecipeIngredients[i].ingredient_id.id;
					console.log($scope.newRecipeIngredients[i]);
				}

				//now assign the newRecipeIngredients array to newRecipe.ingredients
				$scope.newRecipe.recipe_ingredients = $scope.newRecipeIngredients;

				console.log($scope.newRecipe);
				$http.post('http://localhost/MenuList/recipes/add', $scope.newRecipe).then( function addSuccess(response) {
					

					//add the recipe at the beginning of the recipes array
					recipesController.recipes.unshift($scope.newRecipe);

					//update info for pagination and set back to first page
					recipesController.totalItems += 1;
					recipesController.currentPage = 1;

					recipeJustAdded = true;
					open(uibModal, false, 'html/recipes/recipesModalCreate.html');

					$scope.newRecipe = {};

					$uibModalInstance.dismiss('cancel');
				}, 
				function addFail(response) {
					console.log(response.status + "\n" + response.statusText);
				});
			}
			else {
				recipeHasNoIngredients = true;
			}

		};
	});


	recipesModule.controller('RecipesModalViewCtrl', function($scope, $uibModal) {
		$scope.animationsEnabled = true;

		//calls the open function in the global scope, passes the $uibModal dependancy, as well as a true value for animation
		$scope.open = function(recipeId) {
			recipeToViewId = recipeId;
			$uibModal.open({
				animation: true,
				templateUrl: 'html/recipes/recipesModalView.html',
				controller: 'RecipesModalViewInstanceCtrl',
				size: 'lg', //only way I found to add class to the modal dialog							
			});
		};
	});

	recipesModule.controller('RecipesModalViewInstanceCtrl', function($http, $scope, $uibModalInstance) {
		var fetchRecipeUrl = "http://localhost/MenuList/recipes/view/" + recipeToViewId + ".json";
		$scope.imageRequestUrl = 'http://localhost/MenuList/recipes/image/';
		$scope.recipe = {};

		$http.get(fetchRecipeUrl).success(function(data) {
			$scope.recipe = data.recipe;
		});

		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		};
	});
})();