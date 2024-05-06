const RecipeTagRepo = require('../repositories/recipe-tag-repository');

async function getTagsForRecipe(recipe_id) {
  var tagsForRecipe = await RecipeTagRepo.getTagsForRecipe(recipe_id);
  return tagsForRecipe;
}

module.exports = { getTagsForRecipe };
