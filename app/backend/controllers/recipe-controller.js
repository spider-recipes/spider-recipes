var express = require('express');
var router = express.Router();
var S3Service = require('../services/s3-service.js');
var RecipeService = require('../services/recipe-service.js');

router.get('/putImage', async (req, res) => {
  const url = await S3Service.generateUploadURL()
  res.send({ url })
})

router.get('/getRecipes', async (req, res) => {
  const recipes = await RecipeService.getRecipes()
  res.send({ recipes })
})

module.exports = router;
