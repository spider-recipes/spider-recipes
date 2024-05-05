var { getPool } = require('../config/db.js')

async function getRecipes() {
  try {
    const pool = await getPool();
    const recipes = await pool.request().query("SELECT * FROM Recipes");
    return recipes.recordsets;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRecipes
};