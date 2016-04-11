function recipeIngredient() {
	this.id = '';
	this.recipe_id = '';
	this.ingredient_id = '';
	this.quantity = '';
	this.uom_id = '';
	this.instructions = '';
};

//Fetches recipeIngredients with eager loaded ingredients and uoms
//@http: The AngularJS $http service used to make the request
//@recipeId: The id of the recipe for which recipeIngredients are to be fetched
//@return: A javascript Promise
recipeIngredient.prototype.fetchForEdit = function(http, recipeId) {
	var fetchForEditUrl = "http://localhost/MenuList/recipe-ingredients/edit/" + recipeId + ".json";
	
	//Returns a Promise
	return http.get(fetchForEditUrl);
};

recipeIngredient.prototype.update = function(http, recipeIngredient) {
	var updateUrl = 'http://localhost/MenuList/recipe-ingredients/edit/' + recipeIngredient.id + '.json';

	//Returns a promise
	return http.post(updateUrl, recipeIngredient);
};

recipeIngredient.prototype.save = function(http, recipeIngredient) {
	var saveUrl = 'http://localhost/MenuList/recipe-ingredients/add.json';

	//At this point, the recipeIngredient's ingredient_id and uom_id refer to actual ingredient and uom objects
	//We only need the ids, so we alter the values here
	recipeIngredient.ingredient_id = recipeIngredient.ingredient_id.id;
	recipeIngredient.uom_id = recipeIngredient.uom_id.id;

	//Return a Promise
	return http.post(saveUrl, recipeIngredient);
};

recipeIngredient.prototype.delete = function(http, recipeIngredientId) {
	var deleteUrl = 'http://localhost/MenuList/recipe-ingredients/delete/' + recipeIngredientId + '.json';

	return http.post(deleteUrl);
};