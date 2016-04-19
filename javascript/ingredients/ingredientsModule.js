(function(){

	var ingredientsModule = angular.module('IngredientsModule', []);

	var ingredientsController;

	///////////////// Directives ////////////////////

	ingredientsModule.directive('ingredients', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/ingredients/ingredients.html',
			controller: ['$http', '$scope', function($http, $scope) {
				
				var ingredientsInterface = new IngredientsInterface();

				ingredientsController = this;
				ingredientsController.ingredients = [];

				//values required for pagination
				ingredientsController.itemsPerPage = 10;
				ingredientsController.currentPage = 1;
				ingredientsController.totalItems = 0;

				ingredientsInterface.fetchIndex($http).then(function(successResponse){
					ingredientsController.ingredients = successResponse.data.ingredients;
					ingredientsController.totalItems = ingredientsController.ingredients.length;
				}, function(failResponse) {
					console.log("Error fetching ingredients index: " + failResponse.status + "\n" + failResponse.statusText);
				});


				this.imageRequestUrl = 'http://localhost/MenuList/ingredients/image/';

				

				$scope.setPage = function (pageNo) {
					ingredientsController.currentPage = pageNo;
				};

				$scope.displayRecipe = function (index) {

				}
			}],
			controllerAs: 'ingredientsCtrl'
		};
	});	

	ingredientsModule.controller('IngredientsActionsCtrl', ['$http', '$scope', '$uibModal', 'AlertService', 
	  function($http, $scope, $uibModal, AlertService) {
	  	$scope.alertService = AlertService;

	  	$scope.openIngredientCreateModal = function() {
	  		//hide any previous modal alerts
	  		$scope.alertService.hideModalAlert();

			$uibModal.open({
				animation: true,
				templateUrl: 'html/ingredients/ingredientsModalCreate.html',
				controller: 'IngredientModalCreateInstanceCtrl',
				size: 'sm ingredientCreateModalDialog', //only way I found to add class to the modal dialog		
			});
	  	};

	  	$scope.deleteIngredient = function(ingredientId, index) {
	  		//Hide any previous alerts
	  		$scope.alertService.hidePageAlert();

	  		var deleteIngredient = confirm('Are you sure you want to delete this ingredient?');

	  		if(deleteIngredient) {
	  			//Need to make sure the index takes pagination into account
	  			var removeIndex = index + ((ingredientsController.currentPage - 1) * ingredientsController.itemsPerPage);

	  			var ingredientsInterface = new IngredientsInterface();
	  			ingredientsInterface.delete($http, ingredientId).then(function(successResponse) {
	  				//Remove the ingredient from the array
	  				ingredientsController.ingredients.splice(removeIndex, 1);

	  				//Update pagination info
	  				ingredientsController.totalItems -= 1;

	  				$scope.alertService.showPageAlert('alert-success', 'The ingredient has been deleted');
	  			}, function(failResponse) {
	  				console.log(failResponse.status + "\n" + failResponse.statusText);
	  			});
	  		}
	  	};
	}]);


	ingredientsModule.controller('IngredientModalCreateInstanceCtrl', ['$http', '$scope', '$uibModalInstance', 'AlertService',
	  function($http, $scope, $uibModalInstance, AlertService) {
	  	//must declare scope variable for AlertService in order to expose its properties to the view
	  	$scope.alertService = AlertService;

	  	$scope.ingredientsInterface = new IngredientsInterface();
	  	$scope.newIngredient = new Ingredient();
	  	$scope.categoriesList = [];

	  	//fetch the categories
	  	$http.get('http://localhost/MenuList/categories.json').then(function(successResponse) {
	  		$scope.categoriesList = successResponse.data.categories;
	  	}, function(failResponse) {
	  		console.log(failResponse.status + "\n" + failResponse.statusText);
	  	});

	  	$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.createIngredient = function(ingredientCreateForm) {
			console.log($scope.newIngredient);

			//hide any previous modal alerts
			$scope.alertService.hideModalAlert();

			$scope.ingredientsInterface.create($http, $scope.newIngredient).then(function(successResponse) {
				//the response includes the newly created ingredient along with the proper id
				//add the ingredient at the beginning of the recipes array
				ingredientsController.ingredients.unshift(successResponse.data.ingredient);

				//update info for pagination and set back to first page
				ingredientsController.totalItems += 1;
				ingredientsController.currentPage = 1;

				$scope.alertService.showModalAlert('alert-success', 'The recipe has been created.');

				//Will clear the forms' fields and clear the list of ingredients so none are displayed
				$scope.newIngredient = new Ingredient();
				ingredientCreateForm.$setPristine();
				$scope.alertService.showModalAlert('alert-success', 'The ingredient has been created.');
			}, function(failResponse) {
				console.log(failResponse.status + "\n" + failResponse.statusText);
			});
		};
	}]);

})();