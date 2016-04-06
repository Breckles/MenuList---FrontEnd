function uom() {
	this.id = '';
	this.name = '';
	this.description = '';
};





//Fetches a list of all existing recipes in the database
//@http: The AngularJS $http service used to make the request
//@return: A javascript promise
uom.prototype.fetchIndex = function(http) {
	var fetchUomsIndexUrl = 'http://localhost/MenuList/uoms.json';

	//Returns a Promise
	return http.get(fetchUomsIndexUrl);	
};