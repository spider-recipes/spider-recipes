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
                        .query("SELECT Reviews.* FROM Reviews \
                        INNER JOIN Recipes ON Reviews.recipe_id = Recipes.recipe_id \
                        WHERE Recipes.recipe_id=@recipe_id;");
      return reviewsForRecipe.recordsets;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  
module.exports = {
    getAllReviews, getReviewsForRecipe,
};
