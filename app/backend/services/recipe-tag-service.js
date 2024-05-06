var { getPool } = require('../config/db.js')
var sql = require('mssql');

async function getTagsForRecipe(recipeId) {
  try {
    const pool = await getPool();
    console.log("recipeId, ", recipeId);
    const tagsForRecipe = await pool.request()
      .input('recipe_id', sql.Int, recipeId)
      .query("SELECT Tags.tag_name FROM Tags \
                      INNER JOIN RecipeTags ON Tags.tag_id = RecipeTags.tag_id \
                      WHERE RecipeTags.recipe_id=@recipe_id;");
    return tagsForRecipe.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getTagsForRecipe };
