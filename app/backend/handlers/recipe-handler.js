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

router.get('/getRecipesExtended', async (req, res) => {
  const recipesExtended = await RecipeService.getRecipesExtended()
  res.send({ recipesExtended })
})

router.get('/getRecipe/:recipeId', async (req, res) => {
  const recipeById = await RecipeService.getRecipeById(req.params.recipeId)
  res.send({ recipeById })
})

router.get('/getFavouritedRecipes/:userId', async (req, res) => {
  const userFavouritedRecipes = await RecipeService.getUserFavouritedRecipes(req.params.userId)
  res.send({ userFavouritedRecipes })
})

router.post('/addRecipe', async (req, res) => {
  recipeName = req.body["recipe_name"];
  console.log(recipeName);
  const newRecipe = await RecipeService.createRecipe(req.body);
  res.send({ newRecipe });
});

router.post('/addFavourite', async (req, res) => {
  recipe_id = req.body["recipe_id"];
  console.log(recipe_id);
  const newFavourite = await RecipeService.createFavouriteForRecipe(req.body);
  res.send({ newFavourite });
});

router.delete('/removeFavourite', async (req, res) => {
  // recipe_id = req.body["recipe_id"];
  // console.log(recipe_id);
  const deleteFavourite = await RecipeService.deleteFavourite(req.body);
  res.send({ deleteFavourite });
});

router.get('/getRecipeExtended/:recipeId', async (req, res) => {
  const recipeExtendedById = await RecipeService.getRecipeExtendedById(req.params.recipeId)
  res.send({ recipeExtendedById })
})

router.get('/getRecipesByTags', async (req, res) => {
  const recipeByTags = await RecipeService.getRecipesByTags(req.body.tags);
  res.send({ recipeByTags });
});

module.exports = router;
