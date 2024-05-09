const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");
require("dotenv").config();

console.log("apisecret", process.env.APISECRET);

const jwtCheck = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
  secret: process.env.APISECRET,
  tokenSigningAlg: 'HS256'
});

module.exports = jwtCheck;
