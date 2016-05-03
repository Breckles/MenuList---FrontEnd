function IngredientInterface() {
	
};

//Fetches a list of all existing ingredients in the database, with eager loaded categories
//@http: The AngularJS $http service used to make the request
IngredientInterface.prototype.fetchIndex = function(http) {
	var fetchIngredientsIndexUrl = 'http://localhost/MenuList/ingredients.json';

	//Returns a Promise
	return http.get(fetchIngredientsIndexUrl);	
};

//Save the new Ingredient on the server
//@http: The AngularJS $http service used to make the request
//@return: A Javascript Promise
IngredientInterface.prototype.create = function(http, newIngredient) {
	var createIngredientUrl = 'http://localhost/MenuList/ingredients/add.json';

	//At this point, this.category_id holds the category object
	//We need the category id for the request, so we alter the value here
	newIngredient.category_id = newIngredient.category_id.id;

	//Return a promise
	return http.post(createIngredientUrl, newIngredient);
};

IngredientInterface.prototype.delete = function(http, recipeId) {
	var deleteIngredientUrl = 'http://localhost/MenuList/ingredients/delete/' + recipeId + '.json';

	return http.post(deleteIngredientUrl);
};