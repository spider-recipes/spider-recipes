var express = require('express');
var router = express.Router();
var ReviewService = require('../services/review-service.js');

router.get('/getReviews', async (req, res) => {
  const reviews = await ReviewService.getAllReviews();
  res.send({ reviews });
});

router.get('/getReviews/:recipeId', async (req, res) => {
  const reviewsForRecipe = await ReviewService.getReviewsForRecipe(req.params.recipeId);
  res.send({ reviewsForRecipe });
});

router.get('/getRating/:recipeId', async (req, res) => {
  const rating = await ReviewService.getRating(req.params.recipeId);
  res.send({ rating });
});

module.exports = router;
