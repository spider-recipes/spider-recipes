class Recipe {
  constructor(recipe_id, recipe_name, recipe_ingredients, recipe_steps, recipe_preparation_time_minutes, recipe_cooking_time_minutes, recipe_image, time_created, deleted, user_id) {
    this.recipe_id = recipe_id;
    this.recipe_name = recipe_name;
    this.recipe_ingredients = recipe_ingredients;
    this.recipe_steps = recipe_steps;
    this.recipe_preparation_time_minutes = recipe_preparation_time_minutes;
    this.recipe_cooking_time_minutes = recipe_cooking_time_minutes;
    this.recipe_image = recipe_image;
    this.time_created = time_created;
    this.deleted = deleted;
    this.user_id = user_id;
  }
}

model.exports = {
  Recipe
};