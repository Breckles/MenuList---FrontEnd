function ingredient() {
	this.recipe_id = '';
	this.ingredient_id = '';
	this.quantity = '';
	this.uom_id = '';
	this.instructions = '';
};

//Fetches a list of all existing ingredients in the database
//@http: The AngularJS $http service used to make the request
ingredient.prototype.fetchIndex = function(http) {
	var fetchIngredientsIndexUrl = 'http://localhost/MenuList/ingredients.json';

	//Returns a Promise
	return http.get(fetchIngredientsIndexUrl);
	
};