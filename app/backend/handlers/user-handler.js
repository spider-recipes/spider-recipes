var express = require('express');
var router = express.Router();
var UserService = require('../services/user-service.js');
const jwtCheck = require('../../auth-middleware.js');

router.get('/getUsers', async (req, res) => {
  const users = await UserService.getUsers();
  res.send({ users });
});

router.get('/getUserInfo/:userId', async (req, res) => {
  const userInfo = await UserService.getUserInfo(req.userId);
  res.send({ userInfo });
});

router.get('/getUserInfoByUsername/:username', jwtCheck, async (req, res) => {
  const userInfo = await UserService.getUserInfoByUserName(req.username);
  res.send({ userInfo });
});

router.get('/getProfileInfo/:userId', jwtCheck, async (req, res) => {
  const profileInfo = await UserService.getProfileInfo(req.userId);
  res.send({ profileInfo });
});

router.put('/createUser', async (req, res) => {
  const user = await UserService.createUser(req.body);
  res.send({ user });
});

module.exports = router;
