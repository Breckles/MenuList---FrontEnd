(function(){

	var appModule = angular.module('appModule', ['ui.bootstrap', 'recipesModule', 'ingredientsModule']);

	var requestURL = "";


	appModule.controller('appModuleController', ['$http','$rootScope', function($http, $rootScope) {

		this.currentPanel = 'recipesPanel';

		this.isPanelSelected = function(panel) {
			return this.currentPanel === panel;
		};

		this.selectPanel = function(newCurrentPanel) {
			this.currentPanel = newCurrentPanel;
		};

	}]);

})();