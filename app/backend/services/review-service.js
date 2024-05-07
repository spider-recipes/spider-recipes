var { getPool } = require('../config/db.js')
var sql = require('mssql');

async function getAllReviews() {
  try {
    const pool = await getPool();
    const allReviews = await pool.request().query("SELECT * FROM Reviews;");
    return allReviews.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getReviewsForRecipe(recipeId) {
  try {
    const pool = await getPool();
    console.log("recipeId, ", recipeId);
    const reviewsForRecipe = await pool.request()
      .input('recipe_id', sql.Int, recipeId)
      .query(`SELECT Reviews.* FROM Reviews 
                      INNER JOIN Recipes R ON Reviews.recipe_id = R.recipe_id 
                      WHERE R.recipe_id=@recipe_id AND 
                      R.deleted = 0`);
    return reviewsForRecipe.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getRating(recipeId) {
  try {
    const pool = await getPool();
    const rating = await pool.request()
      .input('recipe_id', sql.Int, recipeId)
      .query(`SELECT CAST(AVG(CAST(review_rating AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS avg_rating 
              FROM Reviews 
              INNER JOIN Recipes R ON Reviews.recipe_id = R.recipe_id
              WHERE Reviews.recipe_id = @recipe_id AND R.deleted = 0;`);
    return rating.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createReview(body) {
  try {
    const pool = await getPool();
    const newReview = await pool.request()
        .input('review_rating', sql.Int, body.review_rating)
        .input('review_message', sql.NVarChar, body.review_message)
        // .input('time_created', sql.DateTime, NOW())
        .input('user_id', sql.Int, body.user_id)
        .input('recipe_id', sql.Int, body.recipe_id)
        .query("INSERT INTO Reviews (review_rating, review_message, time_created, user_id, recipe_id) \
                VALUES \
                (@review_rating, @review_message, GETDATE(), @user_id, @recipe_id);");
    return newReview.recordsets;

  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = { getAllReviews, getReviewsForRecipe, getRating, createReview };
