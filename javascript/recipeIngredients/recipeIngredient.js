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
}

recipeIngredient.prototype.update = function(http, recipeIngredient) {
	var updateUrl = 'http://localhost/MenuList/recipe-ingredients/edit/' + recipeIngredient.id + '.json';

	//if the uom was changed, then the uom_id must reflect the new uom's id
	recipeIngredient.uom_id =  recipeIngredient.uom.id;

	console.log(recipeIngredient);

	//Returns a promise
	return http.post(updateUrl, recipeIngredient);
}

