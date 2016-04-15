function ingredient() {
	this.name = '';
	this.category_id = '';
	this.information = '';
	this.image = '';
};

//Fetches a list of all existing ingredients in the database, with eager loaded categories
//@http: The AngularJS $http service used to make the request
ingredient.prototype.fetchIndex = function(http) {
	var fetchIngredientsIndexUrl = 'http://localhost/MenuList/ingredients.json';

	//Returns a Promise
	return http.get(fetchIngredientsIndexUrl);	
};

//Save the new Ingredient on the server
//@http: The AngularJS $http service used to make the request
//@return: A Javascript Promise
ingredient.prototype.create = function(http) {
	var createIngredientUrl = 'http://localhost/MenuList/ingredients/add.json';

	//At this point, this.category_id holds the category object
	//We need the category id for the request, so we alter the value here
	this.category_id = this.category_id.id;

	//Return a promise
	return http.post(createIngredientUrl, this);
}