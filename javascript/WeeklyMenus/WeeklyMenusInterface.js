function WeeklyMenusInterface() {
	this.something = [];
};

//Fetches all existing weeklyMenus
//@http: The AngularJS $http service used to make the request
//@return: A Javascript Promise
WeeklyMenusInterface.prototype.fetchIndex = function(http) {
	var fetchIndexUrl = 'http://localhost/MenuList/weekly-menus.json';

	return http.get(fetchIndexUrl);
};