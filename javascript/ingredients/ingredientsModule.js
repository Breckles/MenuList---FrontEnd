(function(){

	var ingredientsModule = angular.module('ingredientsModule', []);

	var ingredientsController;

	///////////////// Directives ////////////////////

	ingredientsModule.directive('ingredients', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/ingredients/ingredients.html',
			controller: ['$http', '$scope', function($http, $scope) {
				
				var ingredientModel = new ingredient();

				ingredientsController = this;
				ingredientsController.ingredients = [];

				ingredientsController.totalItems = 0;

				ingredientModel.fetchIndex($http).then(function(successResponse){
					ingredientsController.ingredients = successResponse.data.ingredients;
					ingredientsController.totalItems = ingredientsController.ingredients.length;
				}, function(failResponse) {
					console.log("Error fetching ingredients index: " + failResponse.status + "\n" + failResponse.statusText);
				});


				this.imageRequestUrl = 'http://localhost/MenuList/ingredients/image/';

				//pagination implementation
				ingredientsController.itemsPerPage = 10;
				ingredientsController.currentPage = 1;

				$scope.setPage = function (pageNo) {
					ingredientsController.currentPage = pageNo;
				};

				$scope.displayRecipe = function (index) {

				}
			}],
			controllerAs: 'ingredientsCtrl'
		};
	});	

})();