var express = require('express');
var router = express.Router();

// This is only here as an example 
router.get('/', function (req, res, next) {
  res.send('Welcome to the server api');
});

module.exports = router;
