(function(){

	var recipesModule = angular.module('recipesModule', []);


	var recipesController;
	var recipeJustAdded;

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
			open($uibModal, true, 'html/recipes/recipesModalCreate.html');
		}
	});


	recipesModule.controller('RecipesModalCreateInstanceCtrl', function($http, $scope, $uibModalInstance, uibModal) {
		
		$scope.newRecipe = {
			user_id: 1,
			name: 'get new add page with success message',
			description: 'sss',
			instructions: 'sss',
			num_served: 4,
			image: 'no_image.jpg',
			private: true
		}

		$scope.newRecipeIngredients = [];
		

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


		//this is messed up and I will have to find a different way to do things and implement best practice.
		//essentially, the function makes the post request to create a new recipe. Upon success, it creates another 
		//modal (without animation) with the response body, then closes the first one. This causes an unpleasant flicker on the screen.
		//I did this because I could not find a way to simply swap the template for the existing modal.
		$scope.submit = function() {			

			// $http.post('http://localhost/MenuList/recipes/add', $scope.newRecipe).then($scope.addSuccess(), $scope.addFail());

			console.log($scope.newRecipe);
			$http.post('http://localhost/MenuList/recipes/add', $scope.newRecipe).then( function addSuccess(response) {
				// template = response.data;

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
		};
	});
})();