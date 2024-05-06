var express = require('express');
var router = express.Router();
var UserService = require('../services/user-service.js');

router.get('/getAllUsernames', async (req, res) => {
  const usernames = await UserService.getAllUsernames();
  res.send({ usernames });
});

router.get('/getProfileInfo/:userId', async (req, res) => {
  const profileInfo = await UserService.getProfileInfo(req.params.userId);
  res.send({ profileInfo });
});

module.exports = router;
