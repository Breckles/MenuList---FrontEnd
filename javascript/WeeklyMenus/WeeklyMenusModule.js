(function(){

	var weeklyMenusModule = angular.module('WeeklyMenusModule', []);

	var weeklyMenusController;

	/////////////// Directives ///////////////////

	weeklyMenusModule.directive('weeklyMenus', function() {
		return {
			restrict: 'E',
			templateUrl: 'html/weeklyMenus/weeklyMenus.html',
			controller: ['$http', '$scope', function($http, $scope) {
				weeklyMenusController = this;

				var weeklyMenusInterface = new WeeklyMenusInterface();
				$scope.weeklyMenusList = [];
				$scope.currentWeeklyMenu;

				weeklyMenusInterface.fetchIndex($http).then(function(successResponse) {
					console.log("fetched weeklyMenus");
				}, function(failResponse) {
					console.log("Error fetching weeklyMenus\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
				});

				
			}],
			controllerAs: 'weeklyMenusCtrl'
		};
	});



})();