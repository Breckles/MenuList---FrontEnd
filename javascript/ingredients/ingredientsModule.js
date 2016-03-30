(function(){

	var ingredientsModule = angular.module('ingredientsModule', []);

	var ingredientsController;

	///////////////// Directives ////////////////////

	ingredientsModule.directive('ingredients', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/ingredients/ingredients.html',
			controller: ['$http', '$scope', function($http, $scope) {
				
				ingredientsController = this;
				ingredientsController.ingredients = [];

				ingredientsController.totalItems = 0;

				var fetchIngredientsIndexUrl = 'http://localhost/MenuList/ingredients.json';

				$http.get(fetchIngredientsIndexUrl).success(function(data){
					ingredientsController.ingredients = data.ingredients;
					ingredientsController.totalItems = ingredientsController.ingredients.length;
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