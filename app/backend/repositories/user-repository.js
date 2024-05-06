var { getPool } = require('../config/db.js')
var sql = require('mssql');

async function getAllUsernames() {
  try {
    const pool = await getPool();
    const users = await pool.request().query("SELECT * FROM Users");
    return users.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getProfileInfo(userId) {
  try {
    const pool = await getPool();
    const profileInfo = await pool.request()
                        .input('user_id', sql.Int, userId)
                        .query("SELECT Users.*, Reviews.*, Recipes.* FROM Users \
                        INNER JOIN Reviews ON Users.user_id = Reviews.user_id \
                        INNER JOIN Recipes ON Users.user_id = Recipes.user_id \
                        WHERE Users.user_id=@user_id;");
    return profileInfo.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = {
  getAllUsernames, getProfileInfo,
};