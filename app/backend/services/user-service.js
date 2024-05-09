var { getPool } = require('../config/db.js')
var sql = require('mssql');

async function getUsers() {
  try {
    const pool = await getPool();
    const users = await pool.request().query("SELECT user_id, username, created_date FROM Users");
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
    return userInfo.recordsets[0][0];
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
                        LEFT JOIN Recipes ON Users.user_id = Recipes.user_id \
                        LEFT JOIN Reviews ON Users.user_id = Reviews.user_id \
                        WHERE Users.user_id=@user_id;");
    return profileInfo.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function updateUserToken(username, token) {
  try {
    const pool = await getPool();
    const userInfo = await pool.request()
      .input('username', sql.VarChar(255), username)
      .input('auth_token', sql.VarChar(1024), token)
      .query(`UPDATE Users SET auth_token = @auth_token WHERE username = @username`);

    // Retrieve updated user info
    const updateUser = await pool.request()
      .input('username', sql.VarChar(255), username)
      .query(`SELECT * FROM Users WHERE username = @username`);

    return updateUser.recordset[0];

  } catch (error) {
    console.log(error);
    return [];
  }
}

async function checkIfUserExists(username) {
  try {
    const pool = await getPool();
    // Check if the user already exists
    const checkUser = await pool.request()
      .input('username', sql.VarChar(255), username)
      .query(`SELECT TOP 1 Users.user_id, Users.username, Users.created_date FROM Users WHERE username = @username`);

    if (checkUser.recordset.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

async function createUser(username, token) {
  try {
    const pool = await getPool();
    const checkUser = await checkIfUserExists(username);

    if (checkUser) {
      // User exists, update the user's auth token
      const updatedUser = await updateUserToken(username, token);
      return updatedUser;
    } else {
      // User doesn't exist, create a new user
      const userInfo = await pool.request()
        .input('username', sql.VarChar(255), username)
        .input('auth_token', sql.VarChar(1024), 'fdsgsgshshsh')
        .input('created_date', sql.DateTime, new Date().toISOString())
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
