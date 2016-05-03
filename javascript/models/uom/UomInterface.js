function UomInterface() {
	
};


//Fetches a list of all existing recipes in the database
//@http: The AngularJS $http service used to make the request
//@return: A javascript promise
UomInterface.prototype.fetchIndex = function(http) {
	var fetchUomsIndexUrl = 'http://localhost/MenuList/uoms.json';

	//Returns a Promise
	return http.get(fetchUomsIndexUrl);	
};