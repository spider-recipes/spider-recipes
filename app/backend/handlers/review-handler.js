var express = require('express');
var router = express.Router();
var ReviewService = require('../services/review-service.js');
const jwtCheck = require('../../auth-middleware.js');

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

router.post('/addReview', jwtCheck, async (req, res) => {
  review_rating = req.body["review_rating"];
  console.log(review_rating);
  const newReview = await ReviewService.createReview(req.body);
  res.send({ newReview });
});


module.exports = router;
