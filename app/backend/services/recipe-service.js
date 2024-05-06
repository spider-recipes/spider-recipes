var { getPool } = require('../config/db.js')
var sql = require('mssql')

async function getRecipes() {
  try {
    const pool = await getPool();
    const recipes = await pool.request().query("SELECT * FROM Recipes");
    return recipes.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getRecipeById(recipeId) {
  try {
    const pool = await getPool();
    const recipeById = await pool.request()
      .input('recipe_id', sql.Int, recipeId)
      .query("SELECT * FROM Recipes WHERE Recipes.recipe_id=@recipe_id");
    return recipeById.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getRecipes, getRecipeById };
