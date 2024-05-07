var express = require('express');
var router = express.Router();
var UserService = require('../services/user-service.js');

router.get('/getUsers', async (req, res) => {
  const users = await UserService.getUsers();
  res.send({ users });
});

router.get('/getUserInfo/:userId', async (req, res) => {
  const userInfo = await UserService.getUserInfo(req.params.userId);
  res.send({ userInfo });
});

router.get('/getProfileInfo/:userId', async (req, res) => {
  const profileInfo = await UserService.getProfileInfo(req.params.userId);
  res.send({ profileInfo });
});

router.post('/createUser', async (req, res) => {
  const user = await UserService.createUser(req.body);
  res.send({ user });
});

module.exports = router;
