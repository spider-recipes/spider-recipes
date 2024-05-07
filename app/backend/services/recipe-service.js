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

async function getRecipesExtended() {
  try {
    const pool = await getPool();
    const recipesExtended = await pool.request().query(`
      SELECT 
        R.recipe_id,
        R.recipe_name,
        R.recipe_ingredients,
        R.recipe_steps,
        R.recipe_preparation_time_minutes,
        R.recipe_cooking_time_minutes,
        R.recipe_serves,
        R.recipe_image,
        R.time_created,
        CAST(AVG(CAST(review_rating AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS avg_rating,
        (
          SELECT 
            STRING_AGG(T.tag_name, ', ') AS tags
          FROM 
            RecipeTags RT
          INNER JOIN 
            Tags T ON RT.tag_id = T.tag_id
          WHERE 
            RT.recipe_id = R.recipe_id
        ) AS tags
      FROM 
        Recipes R
      LEFT JOIN 
        Reviews RV ON R.recipe_id = RV.recipe_id
      WHERE 
        R.deleted = 0
      GROUP BY 
        R.recipe_id,
        R.recipe_name,
        R.recipe_ingredients,
        R.recipe_steps,
        R.recipe_preparation_time_minutes,
        R.recipe_cooking_time_minutes,
        R.recipe_serves,
        R.recipe_image,
        R.time_created
    `);
    return recipesExtended.recordsets;
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

async function getUserFavouritedRecipes(userId) {
  try {
    const pool = await getPool();
    const userFavouritedRecipes = await pool.request()
        .input('user_id', sql.Int, userId)
        .query("SELECT Recipes.* FROM Recipes \
                INNER JOIN FavouritedRecipes ON Recipes.recipe_id = FavouritedRecipes.recipe_id \
                WHERE FavouritedRecipes.user_id=@user_id;");
    return userFavouritedRecipes.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}
    
async function getRecipeExtendedById(recipeId) {
  try {
    const pool = await getPool();
    const recipeExtendedById = await pool.request()
      .input('recipe_id', sql.Int, recipeId)
      .query(`
      SELECT 
        R.recipe_id,
        R.recipe_name,
        R.recipe_ingredients,
        R.recipe_steps,
        R.recipe_preparation_time_minutes,
        R.recipe_cooking_time_minutes,
        R.recipe_serves,
        R.recipe_image,
        R.time_created,
        CAST(AVG(CAST(review_rating AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS avg_rating,
        (
          SELECT 
            STRING_AGG(T.tag_name, ', ') AS tags
          FROM 
            RecipeTags RT
          INNER JOIN 
            Tags T ON RT.tag_id = T.tag_id
          WHERE 
            RT.recipe_id = R.recipe_id
        ) AS tags
      FROM 
        Recipes R
      LEFT JOIN 
        Reviews RV ON R.recipe_id = RV.recipe_id
      WHERE 
        R.deleted = 0 AND R.recipe_id=@recipe_id
      GROUP BY 
        R.recipe_id,
        R.recipe_name,
        R.recipe_ingredients,
        R.recipe_steps,
        R.recipe_preparation_time_minutes,
        R.recipe_cooking_time_minutes,
        R.recipe_serves,
        R.recipe_image,
        R.time_created
    `);
    return recipeExtendedById.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createRecipe(body) {
  try {
    const pool = await getPool();
    const newRecipe = await pool.request()
        .input('recipe_name', sql.NVarChar, body.recipe_name)
        .input('recipe_ingredients', sql.NVarChar, body.recipe_ingredients)
        .input('recipe_steps', sql.NVarChar, body.recipe_steps)
        .input('recipe_preparation_time_minutes', sql.Int, body.recipe_preparation_time_minutes)
        .input('recipe_cooking_time_minutes', sql.Int, body.recipe_cooking_time_minutes)
        .input('recipe_serves', sql.Int, body.recipe_serves)
        .input('recipe_image', sql.NVarChar, body.recipe_image)
        // .input('time_created', sql.DateTime, NOW())
        .input('deleted', sql.Bit, body.deleted)
        .input('user_id', sql.Int, body.user_id)
        .query("INSERT INTO Recipes (recipe_name, recipe_ingredients, recipe_steps, recipe_preparation_time_minutes, recipe_cooking_time_minutes, recipe_serves, recipe_image, time_created, user_id) \
                VALUES \
              (@recipe_name, @recipe_ingredients, @recipe_steps, @recipe_preparation_time_minutes, @recipe_cooking_time_minutes, @recipe_serves, @recipe_image, GETDATE(), @user_id);");
    return newRecipe.recordsets;
    
  } catch (error) {
    console.log(error);
    return [];
  }
}
async function getRecipesByTags(tags) {
  try {
    const pool = await getPool();
    const recipesByTags = await pool.request()
      .query(`
          SELECT DISTINCT r.*
          FROM Recipes r
          JOIN RecipeTags rt ON r.recipe_id = rt.recipe_id
          JOIN Tags t ON rt.tag_id = t.tag_id
          WHERE t.tag_name IN (${tags.map(tag => `'${tag}'`).join(',')})
    `);
    return recipesByTags.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createFavouriteForRecipe(body){
  try {
    const pool = await getPool();
    const newFavourite = await pool.request()
        .input('user_id', sql.Int, body.user_id)
        .input('recipe_id', sql.Int, body.recipe_id)
        .query("INSERT INTO FavouritedRecipes (user_id, recipe_id) \
                VALUES \
                (@user_id, @recipe_id);");
    return newFavourite.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}

async function deleteFavourite(body){
  try {
    const pool = await getPool();
    const deleteFavourite = await pool.request()
        .input('user_id', sql.Int, body.user_id)
        .input('recipe_id', sql.Int, body.recipe_id)
        .query("DELETE FROM FavouritedRecipes WHERE recipe_id = @recipe_id AND user_id=@user_id;");
            
    return deleteFavourite.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getRecipes, getRecipesExtended, getRecipeExtendedById, getRecipesByTags, getRecipeById, getUserFavouritedRecipes, createRecipe, createFavouriteForRecipe, deleteFavourite };

