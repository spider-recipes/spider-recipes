var express = require('express');
var router = express.Router();
var S3Service = require('../services/s3-service.js');
var RecipeService = require('../services/recipe-service.js');
const jwtCheck = require('../../auth-middleware.js');

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

router.get('/getFavouritedRecipes/:userId', jwtCheck, async (req, res) => {
  const userFavouritedRecipes = await RecipeService.getUserFavouritedRecipes(req.userId)
  res.send({ userFavouritedRecipes })
})

router.get('/getFavouritedRecipesExtended/:userId', jwtCheck, async (req, res) => {
  const userFavouritedRecipesExtended = await RecipeService.getUserFavouritedRecipesExtended(req.userId)
  res.send({ userFavouritedRecipesExtended })
})

router.get('/getRecipeExtended/:recipeId', async (req, res) => {
  const recipeExtendedById = await RecipeService.getRecipeExtendedById(req.params.recipeId)
  res.send({ recipeExtendedById })
})

router.get('/getUserCreatedRecipeExtended/:userId', jwtCheck, async (req, res) => {
  const userCreatedRecipeExtendedById = await RecipeService.getUserCreatedRecipeExtendedById(req.userId)
  res.send({ userCreatedRecipeExtendedById })
})

router.get('/getRecipesByTags', async (req, res) => {
  const recipeByTags = await RecipeService.getRecipesByTags(req.body.tags);
  res.send({ recipeByTags });
});

router.put('/deleteRecipe/:recipeId', jwtCheck, async (req, res) => {
  const deletedRecipe = await RecipeService.deleteRecipe(req.params.recipeId, req.userId);
  res.send({ deletedRecipe });
});

router.post('/addRecipe', jwtCheck, async (req, res) => {
  recipeName = req.body["recipe_name"];
  const newRecipe = await RecipeService.createRecipe(req.body, req.userId);
  res.send({ newRecipe });
});

router.post('/addFavourite', jwtCheck, async (req, res) => {
  const newFavourite = await RecipeService.createFavouriteForRecipe(req.body, req.userId);
  res.send({ newFavourite });
});

router.delete('/removeFavourite', jwtCheck, async (req, res) => {
  const deleteFavourite = await RecipeService.deleteFavourite(req.body, req.userId);
  res.send({ deleteFavourite });
});


module.exports = router;
