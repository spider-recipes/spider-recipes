var { getPool } = require('../config/db.js')
var sql = require('mssql');

async function getUsers() {
  try {
    const pool = await getPool();
    const users = await pool.request().query("SELECT * FROM Users");
    return users.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getUserInfo(userId) {
  try {
    const pool = await getPool();
    const userInfo = await pool.request()
      .input('user_id', sql.Int, userId)
      .query("SELECT * FROM Users \
              WHERE Users.user_id=@user_id;");
    return userInfo.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getUserInfoByUserName(username) {
  try {
    const pool = await getPool();
    const userInfo = await pool.request()
      .input('username', sql.NVarChar, username)
      .query("SELECT * FROM Users \
              WHERE Users.username=@username;");
    return userInfo.recordsets;
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
      .query("SELECT Users.*, Recipes.*, Reviews.* FROM Users \
                        INNER JOIN Recipes ON Users.user_id = Recipes.user_id \
                        INNER JOIN Reviews ON Users.user_id = Reviews.user_id \
                        WHERE Users.user_id=@user_id;");
    return profileInfo.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createUser(user) {
  try {
    const pool = await getPool();
    // Check if the user already exists
    const checkUser = await pool.request()
      .input('username', sql.VarChar(255), user.username)
      .query(`SELECT TOP 1 * FROM Users WHERE username = @username`);

    if (checkUser.recordset.length > 0) {
      // User exists, update the token
      await pool.request()
        .input('username', sql.VarChar(255), user.username)
        .input('auth_token', sql.VarChar(1024), user.authToken)
        .query(`UPDATE Users SET auth_token = @auth_token WHERE username = @username`);

      // Retrieve updated user info
      const updateUser = await pool.request()
        .input('username', sql.VarChar(255), user.username)
        .query(`SELECT * FROM Users WHERE username = @username`);

      // Return updated user info
      return updateUser.recordset[0];
    } else {
      // User doesn't exist, create a new user
      const userInfo = await pool.request()
        .input('username', sql.VarChar(255), user.username)
        .input('auth_token', sql.VarChar(1024), user.authToken)
        .input('created_date', sql.DateTime, user.createdDate)
        .query(`INSERT INTO Users (username, auth_token, created_date)
                OUTPUT inserted.user_id, inserted.username, inserted.auth_token, inserted.created_date
                VALUES (@username, @auth_token, @created_date);
              `);
      return userInfo.recordsets[0];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getUsers, getUserInfo, getUserInfoByUserName, getProfileInfo, createUser };
