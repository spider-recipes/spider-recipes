const ReviewRepo = require('../repositories/review-repository');

async function getAllReviews() {
  var allReviews = await ReviewRepo.getAllReviews();
  return allReviews;
}

async function getReviewsForRecipe(recipe_id) {
  var reviewsForRecipe = await ReviewRepo.getReviewsForRecipe(recipe_id);
  return reviewsForRecipe;
}

module.exports = { getAllReviews, getReviewsForRecipe };
