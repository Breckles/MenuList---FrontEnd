(function(){

	var appModule = angular.module('appModule', ['ui.bootstrap', 'recipesModule', 'ingredientsModule']);

	var requestURL = "";




	appModule.controller('appModuleController', ['$http', '$scope', 'AlertService', function($http, $scope, AlertService) {
		$scope.alertService = AlertService;
		this.currentPanel = 'recipesPanel';		

		this.isPanelSelected = function(panel) {
			return this.currentPanel === panel;
		};

		this.selectPanel = function(newCurrentPanel) {
			this.currentPanel = newCurrentPanel;
		};

		

	}]);

	appModule.service('AlertService', function() {
		//Setup defaults for alerts on Page
		this.displayPageAlert = false;
		this.pageAlertType = 'alert-success' //let's be optimistic!
		this.pageAlertMessage = '';

		this.showPageAlert = function(pageAlertType, pageAlertMessage) {
			this.pageAlertType = pageAlertType;
			this.pageAlertMessage = pageAlertMessage;
			this.displayPageAlert = true;
		};

		this.hidePageAlert = function() {
			this.displayPageAlert = false;
		};

		//Setup defaults for alerts in Modals
		this.displayModalAlert = true;
		this.modalAlertType = 'alert-success' //does it really matter at this point?
		this.modalAlertMessage = 'The recipe has been saved';

		this.showModalAlert = function(modalAlertType, modalAlertMessage) {
			this.modalAlertType = modalAlertType;
			this.modalAlertMessage = modalAlertMessage;
			this.displayModalAlert = true;
		};

		this.hideModalAlert = function() {
			this.displayModalAlert = false;
		};
	});
})();