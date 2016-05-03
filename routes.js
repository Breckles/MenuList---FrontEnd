(function() {

	angular.module('AppModule').config(function($routeProvider) {

		$routeProvider.

			//Recipes routes

			when('/recipes', {
				templateUrl: 'html/templates/recipes/index.html',
				controller: 'RecipesIndexController'
			}).
			when('/recipes/create', {
				templateUrl: 'html/templates/recipes/create.html',
				controller: 'RecipesCreateController'
			}).
			when('/recipes/:id', {
				templateUrl: 'html/templates/recipes/view.html',
				controller: 'RecipesViewController'
			}).
			when('/recipes/edit/:id', {
				templateUrl: 'html/templates/recipes/edit.html',
				controller: 'RecipesEditController'
			}).

			//Ingredients routes

			when('/ingredients', {
				templateUrl: 'html/templates/ingredients/index.html',
				controller: 'IngredientsIndexController'
			}).
			when('/ingredients/create', {
				templateUrl: 'html/templates/ingredients/create.html',
				controller: 'IngredientsCreateController'
			}).

			//WeeklyMenus routes

			when('/weeklyMenus', {
				templateUrl: 'html/templates/weeklyMenus/index.html',
				controller: 'WeeklyMenusIndexController'
			}).











			//Catch-all route
			otherwise({
				redirectTo: '/recipes'
			});

	});

})();