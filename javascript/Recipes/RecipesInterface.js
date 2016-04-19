function RecipesInterface () {
	
};

//Fetches a list of all existing recipes in the database
//@http: The AngularJS $http service used to make the request
//@return: A Javascript Promise
RecipesInterface.prototype.fetchIndex = function(http) {
	var fetchRecipesIndexUrl = 'http://localhost/MenuList/recipes.json';

	//Returns a Promise
	return http.get(fetchRecipesIndexUrl);	
};

//Fetches recipe with eager loaded recipeIngredients, recipeIngredient uoms, and recipeIngredient ingredients
RecipesInterface.prototype.fetchForView = function(http, recipeId) {
	var fetchRecipeUrl = "http://localhost/MenuList/recipes/view/" + recipeId + ".json";

	return http.get(fetchRecipeUrl);
};

//Fetches recipe only, no eager loading
RecipesInterface.prototype.fetchForEdit = function(http, recipeId) {
	var fetchRecipeUrl = "http://localhost/MenuList/recipes/edit/" + recipeId + ".json";

	return http.get(fetchRecipeUrl);
};

//Makes AJAX request to save the recipe on the server
//@http: The AngularJS $http service used to make the request
RecipesInterface.prototype.create = function(http, newRecipe) {
	var saveRecipeUrl = 'http://localhost/MenuList/recipes/add.json';

	//At this point, the recipe_ingredients array elements still hold the actual uom and ingredient objects
	//The request must be made with just the ids, so we format the array elements
	for(var i = 0; i < newRecipe.recipe_ingredients.length; i++)
	{
		newRecipe.recipe_ingredients[i].uom_id = newRecipe.recipe_ingredients[i].uom_id.id;
		newRecipe.recipe_ingredients[i].ingredient_id = newRecipe.recipe_ingredients[i].ingredient_id.id;
	}
	
	return http.post(saveRecipeUrl, newRecipe);	
};

RecipesInterface.prototype.update = function(http, recipe) {
	var updateUrl = 'http://localhost/MenuList/recipes/edit/' + recipe.id + '.json';

	return http.post(updateUrl, recipe);
};

RecipesInterface.prototype.delete = function(http, recipeId) {
	var deleteRecipeUrl = 'http://localhost/MenuList/recipes/delete/' + recipeId + '.json';

	return http.post(deleteRecipeUrl);
};


