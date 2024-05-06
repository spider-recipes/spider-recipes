const RecipeRepo = require('../repositories/recipe-repository');

async function getRecipes() {
  var recipes = await RecipeRepo.getRecipes()
  return recipes
}

async function getRecipeById(recipeId) {
  var recipeById = await RecipeRepo.getRecipeById(recipeId)
  return recipeById
}

module.exports = { getRecipes, getRecipeById };
