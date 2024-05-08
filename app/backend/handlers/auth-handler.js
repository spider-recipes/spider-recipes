var express = require('express');
var router = express.Router();

router.get('/getIsAuthenticated', async (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  res.send({ isAuthenticated });
});

router.get('/getAuthUserInfo', async (req, res) => {
  const authUser = req.oidc.user;
  res.send({ authUser });
});

router.get('/getAccessToken', async (req, res) => {
  let accessToken = req.oidc.accessToken;
  if (accessToken.isExpired()) {
    accessToken = await accessToken.refresh();
  }
  res.send({ accessToken });
});

module.exports = router;