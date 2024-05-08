import AbstractView from "../AbstractView.js";

export default class extends AbstractView
{
  constructor(params)
  {
    super(params);
    this.recipeID = params.id;
    this.setTitle("Spider Recipes | Recipe");
  }

  async getHtml()
  {
    let response = await fetch(`/api/recipe/getRecipeExtended/${this.recipeID}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
    let data = await response.json();
    const recipe = data.recipeExtendedById[0][0];

    response = await fetch(`/api/review/getReviews/${this.recipeID}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
    data = await response.json();
    const reviews = data.reviewsForRecipe[0];

    // Title section
    const titleSection = document.createElement("section");
    titleSection.className = "title-section";

    // Back button
    const backButton = document.createElement("a");
    backButton.className = "back-arrow";
    backButton.href = "/";
    backButton.setAttribute("data-link", "");
    backButton.textContent = "west";

    // Recipe heading
    const recipeHeading = document.createElement("h1");
    recipeHeading.textContent = recipe.recipe_name;

    // Recipe user
    const recipeUser = document.createElement("span");
    recipeUser.id = "recipe-user";
    recipeUser.insertAdjacentHTML("beforeend", `Posted by <strong>${recipe.creator_username}</strong>`); 

    // Recipe date
    const recipeDate = document.createElement("span");
    recipeDate.id = "recipe-date";
    const date = new Date(parseInt(recipe.time_created));
    recipeDate.textContent = `Posted on ${date.toDateString()}`;

    // Rating
    const starsDiv = document.createElement("div");

    const starsFilled = document.createElement("span");
    starsFilled.className = "star";
    for(let i = 0; i < parseInt(recipe.avg_rating); i++)
    {
      starsFilled.textContent += "star ";
    }

    const starsEmpty = document.createElement("span");
    starsEmpty.className = "star starEmpty";
    for(let i = parseInt(recipe.avg_rating); i < 5; i++)
    {
      starsEmpty.textContent += "star ";
    }

    starsDiv.append(starsFilled, starsEmpty);

    // Append to title section
    titleSection.append(backButton, recipeHeading, recipeUser, recipeDate, starsDiv);

    // Recipe section
    const recipeSection = document.createElement("section");
    recipeSection.className = "recipe-section";

    // Recipe img
    const recipeImg = document.createElement("img");
    recipeImg.id = "recipe-img";
    recipeImg.src = recipe.recipe_image;
    recipeImg.alt = "Picture of spider recipe";
    const recipeImgContainer = document.createElement("div");
    recipeImgContainer.className = "img-container";
    recipeImgContainer.appendChild(recipeImg);

    // Tags
    const tagsDiv = document.createElement("div");
    if(recipe.tags)
    {
      const tags = recipe.tags.split(",");
      tagsDiv.className = "tags";
      tags.forEach(tag => {
        const tagSpan = document.createElement("span");
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
      });
    }

    // Recipe info
    const recipeInfo = document.createElement("ul");
    recipeInfo.className = "recipe-info";

    const prepTime = document.createElement("li");
    const prepTimeIcon = document.createElement("span");
    prepTimeIcon.textContent = "restaurant_menu";
    const prepTimeValue = document.createElement("span");
    prepTimeValue.id = "preparation-time";
    prepTimeValue.insertAdjacentHTML("beforeend", `<strong>Preparation time:</strong> ${recipe.recipe_preparation_time_minutes} minutes`);
    prepTime.append(prepTimeIcon, prepTimeValue);

    const cookTime = document.createElement("li");
    const cookTimeIcon = document.createElement("span");
    cookTimeIcon.textContent = "skillet";
    const cookTimeValue = document.createElement("span");
    cookTimeValue.id = "cooking-time";
    cookTimeValue.insertAdjacentHTML("beforeend", `<strong>Cooking time:</strong> ${recipe.recipe_cooking_time_minutes} minutes`);
    cookTime.append(cookTimeIcon, cookTimeValue);

    const serves = document.createElement("li");
    const servesIcon = document.createElement("span");
    servesIcon.textContent = "restaurant";
    const servesValue = document.createElement("span");
    servesValue.id = "serves";
    servesValue.insertAdjacentHTML("beforeend", `<strong>Serves:</strong> ${recipe.recipe_serves}`);
    serves.append(servesIcon, servesValue);

    recipeInfo.append(prepTime, cookTime, serves);

    // Recipe ingredients
    const recipeIngredients = document.createElement("ul");
    recipeIngredients.className = "recipe-ingredients";
    const ingredientHeading = document.createElement("h2");
    ingredientHeading.textContent = "Ingredients";
    recipeIngredients.appendChild(ingredientHeading);

    recipe.recipe_ingredients.split(";").forEach(ingredient => {
      const ingredientLi = document.createElement("li");
      ingredientLi.textContent = ingredient;
      recipeIngredients.appendChild(ingredientLi);
    });

    // Recipe steps
    const recipeSteps = document.createElement("ol");
    recipeSteps.className = "recipe-steps";
    const stepsHeading = document.createElement("h2");
    stepsHeading.textContent = "How to make";
    recipeSteps.appendChild(stepsHeading);

    recipe.recipe_steps.split(";").forEach(step => {
      const stepLi = document.createElement("li");
      stepLi.textContent = step;
      recipeSteps.appendChild(stepLi);
    });

    // Append to recipe section
    recipeSection.append(recipeImgContainer, tagsDiv, recipeInfo, recipeIngredients, recipeSteps);

    // Review section
    const reviewSection = document.createElement("section");
    reviewSection.className = 'review-section';

    // Review heading
    const reviewHeading = document.createElement("h2");
    reviewHeading.textContent = "Reviews";

    // Recipe reviews
    const recipeReviews = document.createElement("ul");
    recipeReviews.id = "recipe-reviews";
    
    reviews.forEach(review => {
      const reviewLi = document.createElement("li");
      const usernameSpan = document.createElement("span");
      const dateSpan = document.createElement("span");
      const starsFilledSpan = document.createElement("span");
      const starsEmptySpan = document.createElement("span");
      const starsDiv = document.createElement("div");
      const messageSpan = document.createElement("span");
      
      const date = new Date(parseInt(review.time_created));
      
      usernameSpan.insertAdjacentHTML("beforeend", `<strong>${review.creator_username}</strong>`);
      dateSpan.className = "date";
      dateSpan.textContent = ` - ${date.toDateString()}`;
      
      starsFilledSpan.className = "star";
      for(let i = 0; i < parseInt(review.review_rating); i++)
      {
        starsFilledSpan.textContent += "star ";
      }
        
      starsEmptySpan.className = "star starEmpty";
      for(let i = parseInt(review.review_rating); i < 5; i++)
      {
        starsEmptySpan.textContent += "star ";
      }
        starsDiv.append(starsFilledSpan, starsEmptySpan);
        
        messageSpan.textContent = review.review_message;
        
        reviewLi.append(usernameSpan, dateSpan, starsDiv, messageSpan);
        
        recipeReviews.appendChild(reviewLi);
    });

    // Append to review section
    reviewSection.append(reviewHeading, recipeReviews);

    document.getElementById("main-content").replaceChildren(titleSection, recipeSection, reviewSection);
  }
}