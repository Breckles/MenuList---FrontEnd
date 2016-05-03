(function() {

	angular.module('AppModule').service('AlertService', ['$timeout', function($timeout) {
		//Setup defaults for alerts on Page
		this.displayPageAlert = false;
		this.pageAlertType = 'alert-success' //let's be optimistic!
		this.pageAlertMessage = '';

		var service = this;



		this.showPageAlert = function(pageAlertType, pageAlertMessage) {			
			this.pageAlertType = pageAlertType;
			this.pageAlertMessage = pageAlertMessage;
			this.displayPageAlert = true;
			
			$timeout(this.hidePageAlert, 2500);
		};

		this.hidePageAlert = function() {
			//Need to check more into why this works, and using 'this.displayPageAlert' doesn't.
			//I'm pretty sure it has to do with the 'this' reference in the callback
			service.displayPageAlert = false;
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
	}]);
	
})();