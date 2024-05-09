const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");
require("dotenv").config();
const jwtGen = require("jsonwebtoken");

function jwtCheck(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwtGen.verify(token, process.env.JWT_SECRET);
    req.userName = decoded.username;
    // req.userID = decoded.userID;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = jwtCheck;
