(function(){

	var recipesModule = angular.module('recipesModule', []);


	var recipesController;
	var addTemplate = 'http://localhost/MenuList/recipes/add';

	//function to open the modal
	var open = function(uibModal, animationsEnabled, template) {
		console.log('Opening');
		var modalInstance = uibModal.open({
			animation: animationsEnabled,
			template: template,
			controller: 'RecipesModalCreateInstanceCtrl',
			resolve: {
				'uibModal': uibModal
			}			
		});
	};

	///////////////// Directives ////////////////////

	recipesModule.directive('recipes', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/recipes.html',
			controller: ['$http', function($http) {
				
				recipesController = this;

				recipesController.recipes = [];

				var fetchRecipesIndexUrl = 'http://localhost/MenuList/recipes.json';

				$http.get(fetchRecipesIndexUrl).success(function(data){

					recipesController.recipes = data.recipes;

				});


				this.imageRequestUrl = 'http://localhost/MenuList/recipes/image/';
				this.addRecipeUrl = 'http://localhost/MenuList/recipes/add';

			}],
			controllerAs: 'recipesCtrl'
		};
	});	


	recipesModule.controller('RecipesModalCreateCtrl', function($http, $scope, $uibModal, $log) {
		$scope.animationsEnabled = true;
		var template;

		//get the template to add a new recipe, assign the response data (html) to the variable 'addTemplate'
		$http.get('http://localhost/MenuList/recipes/add').success(function(data) {
			template = data;
		});

		//calls the open function in the global scope, passes the $uibModal dependancy, as well as a true value for animation
		$scope.open = function() {
			open($uibModal, true, template);
		}
		// $scope.open = function() {
		// 	console.log('Opening');
		// 	var modalInstance = $uibModal.open({
		// 		animation: $scope.animationsEnabled,
		// 		template: addTemplate,
		// 		controller: 'RecipesModalCreateInstanceCtrl'
		// 	});
		// };
	});


	recipesModule.controller('RecipesModalCreateInstanceCtrl', function($http, $scope, $uibModalInstance, uibModal) {
		
		// $scope.newRecipe = {
		// 	user_id: 1,
		// 	name: 'get new add page with success message',
		// 	description: 'sss',
		// 	instructions: 'sss',
		// 	num_served: 4,
		// 	image: 'no_image.jpg'
		// }

		$scope.newRecipe = {};

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};


		//this is messed up and I will have to find a different way to do things and implement best practice.
		//essentially, the function makes the post request to create a new recipe. Upon success, it creates another 
		//modal (without animation) with the response body, then closes the first one. This causes an unpleasant flicker on the screen.
		//I did this because I could not find a way to simply swap the template for the existing modal.
		$scope.submit = function() {			

			// $http.post('http://localhost/MenuList/recipes/add', $scope.newRecipe).then($scope.addSuccess(), $scope.addFail());


			$http.post('http://localhost/MenuList/recipes/add', $scope.newRecipe).then( function addSuccess(response) {
				console.log(response);
				template = response.data;
				recipesController.recipes.unshift($scope.newRecipe);

				open(uibModal, false, template);

				$scope.newRecipe = {};

				$uibModalInstance.dismiss('cancel');
			}, 
			function addFail(response) {
				console.log(response.status + "\n" + response.statusText);
			});


			// $scope.addSuccess = function(data) {
			// 	template = data;
			// 	recipesController.recipes.unshift($scope.newRecipe);

			// 	open(uibModal, false, template);

			// 	$scope.newRecipe = {};

			// 	$uibModalInstance.dismiss('cancel');
			// };

			// $scope.addFail = function(data, status, statusText) {
			// 	console.log(status + "\n" + statusText);
			// };
		};


	});











})();




// app.directive('productPanels', function() {
// 		return {
// 			restrict: 'E',
// 			templateUrl: 'product-panels.html',
// 			controller: function() {
// 				this.tab = 1;

// 				this.selectTab = function(setTab) {
// 					this.tab = setTab;
// 				};

// 				this.isSelected = function(checkTab) {
// 					return this.tab === checkTab;
// 				};
// 			},
// 			controllerAs: 'panel'

// 		};
// 	});