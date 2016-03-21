(function(){

	var appModule = angular.module('appModule', ['ui.bootstrap', 'recipesModule']);

	var requestURL = "";


	appModule.controller('appModuleController', ['$http', function($http) {

		this.currentPanel = 'mealSchedulePanel';

		this.isPanelSelected = function(panel) {
			return this.currentPanel === panel;
		};

		this.selectPanel = function(newCurrentPanel) {
			this.currentPanel = newCurrentPanel;
		};

	}]);

})();