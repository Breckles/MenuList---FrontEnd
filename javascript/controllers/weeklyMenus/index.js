(function() {

	angular.module('AppModule').controller('WeeklyMenusIndexController', 
	  ['$http', '$scope', '$rootScope', 'AlertService', function($http, $scope, $rootScope, AlertService) {

	  	weeklyMenusController = this;

		var weeklyMenuInterface = new WeeklyMenuInterface();
		$scope.weeklyMenusList = [];
		$scope.currentWeeklyMenu;

		weeklyMenuInterface.fetchIndex($http).then(function(successResponse) {
			console.log("fetched weeklyMenus");
		}, function(failResponse) {
			console.log("Error fetching weeklyMenus\nStatus: " + failResponse.status + "\nStatus Text: " + failResponse.statusText);
		});

	}]);

})();