(function() {

	//Will return a class for the navigation pills.
	//Will make sure the correct nav item is set to active class no matter how the user ended up on the page.
	angular.module('AppModule').service('NavClassService', function($location) {
		this.getClass = function(path) {
			return ($location.path().substr(0, path.length) === path) ? 'active' : '';
		};
	});
	
})();