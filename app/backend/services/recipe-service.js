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

module.exports = { getRecipes, getRecipesExtended, getRecipeById, getRecipeExtendedById, getRecipesByTags };
