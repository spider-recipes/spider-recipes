require('dotenv').config();
var express = require('express');
var router = express.Router();
const jwtGen = require('jsonwebtoken');
var UserService = require('../services/user-service.js');

router.get('/getJwt', async (req, res) => {
  const response = await fetch(`https://github.com/login/oauth/access_token?client_id=Ov23liSccSMzhCE6OZ1n&client_secret=${process.env.GITSECRET}&code=${req.header('Token')}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await response.json();
  if (data.error) {
    console.log(data.error);
  }
  const accessToken = data.access_token;
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: 'token ' + accessToken
    }
  });

  const user = await userResponse.json();
  const username = user.login;
  const createdUser = await UserService.createUser(username);
  const token = jwtGen.sign({ username: username, userId: createdUser.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.send({ token: token, username: createdUser.username, userId: createdUser.user_id });

});

module.exports = router;