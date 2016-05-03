(function(){

	var appModule = angular.module('AppModule', ['ui.bootstrap', 'ngRoute']);


	appModule.controller('AppController', ['$http', '$scope', 'AlertService', 'NavClassService', function($http, $scope, AlertService, NavClassService) {
		$scope.alertService = AlertService;
		// var currentTab = 'ingredientsTab';		

		// this.isTabSelected = function(tab) {
		// 	return currentTab === tab;
		// };

		// this.selectTab = function(tab) {
		// 	currentTab = tab;

		// 	//The selectTab function gets called when a user clicks on a tag wrapped in an anchor (<a>) element.
		// 	//In order to direct the user to the anchor's href, the function must return true
		// 	return true;
		// };


		//This function gets executed a bunch of time for EVERY action a user takes.
		//It might be worth looking for a way to make the process more efficient
		$scope.getNavClass = function(path) {
			// console.log("checking path");
			return NavClassService.getClass(path);
		};

	}]);

})();