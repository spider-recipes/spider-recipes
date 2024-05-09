const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");

const jwtCheck = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
  tokenSigningAlg: 'HS256'
});

module.exports = jwtCheck;