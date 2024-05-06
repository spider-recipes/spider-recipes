var express = require('express');
var router = express.Router();
var RecipeTagService = require('../services/recipe-tag-service.js');

router.get('/getTags/:recipeId', async (req, res) => {
  const tagsForRecipe = await RecipeTagService.getTagsForRecipe(req.params.recipeId);
  res.send({ tagsForRecipe });
});

module.exports = router;
