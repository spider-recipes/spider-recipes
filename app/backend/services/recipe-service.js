const RecipeRepo = require('../repositories/recipe-repository');

async function getRecipes() {
  var recipes = await RecipeRepo.getRecipes()
  return recipes
}

module.exports = { getRecipes };
