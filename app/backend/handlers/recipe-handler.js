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

router.get('/getRecipe/:recipeId', async (req, res) => {
  const recipeById = await RecipeService.getRecipeById(req.params.recipeId)
  res.send({ recipeById })
})

module.exports = router;
