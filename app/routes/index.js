var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile('index.html', { root: __dirname + '/../views/' });
});

// Display welcome message 
router.get('/welcome', function (req, res, next) {
  res.send('welcome to the spider-recipes API');
});

module.exports = router;
