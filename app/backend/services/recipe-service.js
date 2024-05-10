var { getPool } = require('../config/db.js')
var sql = require('mssql')

async function getRecipes() {
  try {
    const pool = await getPool();
    const recipes = await pool.request().query(`SELECT * FROM Recipes R WHERE 
    R.deleted = 0`);
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
    U.username AS creator_username,
    CAST(AVG(CAST(RV.review_rating AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS avg_rating,
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
    LEFT JOIN
        Users U ON R.user_id = U.user_id
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
        R.time_created,
        U.username; 
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
      .query(`SELECT * FROM Recipes R WHERE R.recipe_id=@recipe_id AND R.deleted = 0`);
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

async function getUserFavouritedRecipesExtended(userId) {
  try {
    const pool = await getPool();
    const userFavouritedRecipesExtended = await pool.request()
      .input('user_id', sql.Int, userId)
      .query(`
            SELECT 
            Recipes.recipe_id, 
            Recipes.recipe_name, 
            Recipes.recipe_ingredients, 
            Recipes.recipe_steps, 
            Recipes.recipe_preparation_time_minutes, 
            Recipes.recipe_cooking_time_minutes, 
            Recipes.recipe_serves, 
            Recipes.recipe_image, 
            Recipes.time_created, 
            Recipes.deleted, 
            Recipes.user_id, 
            (SELECT 
              STRING_AGG(T.tag_name, ', ') AS tags
                FROM 
                RecipeTags RT
                INNER JOIN 
                Tags T ON RT.tag_id = T.tag_id
                WHERE 
                RT.recipe_id = Recipes.recipe_id ) AS tags, 
            (SELECT CAST(AVG(CAST(Reviews.review_rating AS DECIMAL(10,2))) AS DECIMAL(10,2)) 
              FROM reviews 
              WHERE Reviews.recipe_id=Recipes.recipe_id) AS avg_rating 
            FROM FavouritedRecipes
            INNER JOIN Recipes ON FavouritedRecipes.recipe_id = Recipes.recipe_id
            LEFT JOIN Reviews ON FavouritedRecipes.recipe_id = Reviews.recipe_id
            LEFT JOIN RecipeTags ON Recipes.recipe_id = RecipeTags.recipe_id
            LEFT JOIN Tags ON RecipeTags.tag_id = Tags.tag_id
            WHERE FavouritedRecipes.user_id=@user_id
            GROUP BY 
              Recipes.recipe_id, 
              Recipes.recipe_name, 
              Recipes.recipe_ingredients, 
              Recipes.recipe_steps, 
              Recipes.recipe_preparation_time_minutes, 
              Recipes.recipe_cooking_time_minutes, 
              Recipes.recipe_serves, 
              Recipes.recipe_image, 
              Recipes.time_created, 
              Recipes.deleted, 
              Recipes.user_id;
        `);

    return userFavouritedRecipesExtended.recordsets;

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
        U.username AS creator_username,
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
      LEFT JOIN
        Users U ON R.user_id = U.user_id
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
        R.time_created,
        U.username; 
    `);
    return recipeExtendedById.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}
async function getUserCreatedRecipeExtendedById(userId) {
  try {
    const pool = await getPool();
    const userCreatedRecipeExtendedById = await pool.request()
      .input('user_id', sql.Int, userId)
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
        U.username AS creator_username,
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
      LEFT JOIN
        Users U ON R.user_id = U.user_id
      WHERE 
        R.deleted = 0 AND R.user_id=@user_id
      GROUP BY 
        R.recipe_id,
        R.recipe_name,
        R.recipe_ingredients,
        R.recipe_steps,
        R.recipe_preparation_time_minutes,
        R.recipe_cooking_time_minutes,
        R.recipe_serves,
        R.recipe_image,
        R.time_created,
        U.username; 
    `);
    return userCreatedRecipeExtendedById.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createRecipe(body, userId) {
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
      .input('user_id', sql.Int, userId)
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
          WHERE t.tag_name IN (${tags.map(tag => `'${tag}'`).join(',')}) AND
          r.deleted = 0
    `);
    return recipesByTags.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createFavouriteForRecipe(body, userId) {
  try {
    const pool = await getPool();
    const newFavourite = await pool.request()
      .input('user_id', sql.Int, userId)
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

async function deleteRecipe(recipeId, userId) {
  try {
    const pool = await getPool();
    await pool.request()
      .input('recipe_id', sql.Int, recipeId)
      .input('user_id', sql.Int, userId)
      .query(`
        UPDATE Recipes
        SET deleted = 1
        WHERE recipe_id = @recipe_id AND user_id = ${userId}
      `);
    const deletedRecipe = await getRecipeExtendedById(recipeId)
    console.log(deletedRecipe);
    return deletedRecipe;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function deleteFavourite(body, userId) {
  try {
    const pool = await getPool();
    const deleteFavourite = await pool.request()
      .input('user_id', sql.Int, userId)
      .input('recipe_id', sql.Int, body.recipe_id)
      .query("DELETE FROM FavouritedRecipes WHERE recipe_id = @recipe_id AND user_id=@user_id;");

    return deleteFavourite.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getRecipes, getRecipesExtended, getRecipeExtendedById, getRecipesByTags, getRecipeById, getUserFavouritedRecipes, getUserFavouritedRecipesExtended, getUserCreatedRecipeExtendedById, createRecipe, createFavouriteForRecipe, deleteFavourite, deleteRecipe };

