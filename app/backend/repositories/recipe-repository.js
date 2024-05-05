var dbConfig = require('../config/db.js')
var sql = require('mssql');

let pool;

async function initializePool() {
  try {
    console.log(dbConfig)
    pool = await sql.connect(dbConfig);
  } catch (error) {
    throw error;
  }
}

async function getRecipes() {
  try {
    if (!pool) {
      await initializePool();
    }
    const request = pool.request();
    const recipes = await request.query("SELECT * FROM Recipes");
    return recipes.recordsets;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRecipes
};