function recipe () {
	this.id = '';
	this.user_id = 1;//until users are implemented
	this.description = '';
	this.instructions = '';
	this.image = '';
	this.private = true;
	this.recipe_ingredients = [];
};

//Fetches a list of all existing recipes in the database
//@http: The AngularJS $http service used to make the request
//@return: A Javascript Promise
recipe.prototype.fetchIndex = function(http) {
	var fetchRecipesIndexUrl = 'http://localhost/MenuList/recipes.json';

	//Returns a Promise
	return http.get(fetchRecipesIndexUrl);	
};

//Fetches recipe with eager loaded recipeIngredients, recipeIngredient uoms, and recipeIngredient ingredients
recipe.prototype.fetchForView = function(http, recipeId) {
	var fetchRecipeUrl = "http://localhost/MenuList/recipes/view/" + recipeId + ".json";

	return http.get(fetchRecipeUrl);
};

//Fetches recipe only, no eager loading
recipe.prototype.fetchForEdit = function(http, recipeId) {
	var fetchRecipeUrl = "http://localhost/MenuList/recipes/edit/" + recipeId + ".json";

	return http.get(fetchRecipeUrl);
};

//Makes AJAX request to save the recipe on the server
//@http: The AngularJS $http service used to make the request
recipe.prototype.save = function(http) {
	var saveRecipeUrl = 'http://localhost/MenuList/recipes/add.json';

	//At this point, the recipe_ingredients array elements still hold the actual uom and ingredient objects
	//The request must be made with just the ids, so we format the array elements
	for(var i = 0; i < this.recipe_ingredients.length; i++)
	{
		this.recipe_ingredients[i].uom_id = this.recipe_ingredients[i].uom_id.id;
		this.recipe_ingredients[i].ingredient_id = this.recipe_ingredients[i].ingredient_id.id;
	}
	
	return http.post(saveRecipeUrl, this);	
};

recipe.prototype.update = function(http, recipe) {
	var updateUrl = 'http://localhost/MenuList/recipes/edit/' + recipe.id + '.json';

	return http.post(updateUrl, recipe);
};

recipe.prototype.delete = function(http, recipeId) {
	var deleteRecipeUrl = 'http://localhost/MenuList/recipes/delete/' + recipeId + '.json';

	return http.post(deleteRecipeUrl);
};


