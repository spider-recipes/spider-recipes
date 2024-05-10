import AbstractView from "../AbstractView.js";
// Retrieving data from local storage
// localStorage.getItem('userId');
// localStorage.getItem('token');
// localStorage.getItem('username');

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.recipeID = params.id;
    this.setTitle("Spider Recipes | Recipe");
    this.stars = 1;
    console.log(localStorage.getItem('username'));
  }

  async getHtml() {
    //Display loader
    const loader = document.createElement("div");
    loader.className = "loader";

    document.getElementById("main-content").replaceChildren(loader);

    let response = await fetch(`/api/recipe/getRecipeExtended/${this.recipeID}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Authorization": `${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    });
    let data = await response.json();
    const recipe = data.recipeExtendedById[0][0];

    response = await fetch(`/api/review/getReviews/${this.recipeID}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Authorization": `${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    });
    data = await response.json();
    const reviews = data.reviewsForRecipe[0];


    if (localStorage.getItem("userId") !== "") {
      response = await fetch(`/api/recipe/getFavouritedRecipes/${localStorage.getItem("userId")}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Authorization": `${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      });

      data = await response.json();
      this.favRecipes = data.userFavouritedRecipes[0];
    }
    else {
      this.favRecipes = [];
    }

    loader.style.display = "none";

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
    const date = new Date(recipe.time_created.substring(0, 10));
    recipeDate.textContent = `Posted on ${date.toDateString()}`;

    // Rating
    const starsDiv = document.createElement("div");

    const starsFilled = document.createElement("span");
    starsFilled.className = "star";
    for (let i = 0; i < parseInt(recipe.avg_rating); i++) {
      starsFilled.textContent += "star ";
    }

    const starsEmpty = document.createElement("span");
    starsEmpty.className = "star starEmpty";
    for (let i = parseInt(recipe.avg_rating); i < 5; i++) {
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

    // Favourite
    const favouriteDiv = document.createElement("div");
    favouriteDiv.className = "favourite-div";
    const favorite = document.createElement("span");
    favorite.className = "favouriteIcon";
    favorite.textContent = "Add to favourites";
    favouriteDiv.appendChild(favorite);
    this.favRecipes.forEach(fav => {
      if (fav.recipe_id === parseInt(this.recipeID)) {
        favorite.classList.add("favourited");
        favorite.textContent = "Remove from favourites";
      }
    })

    favorite.addEventListener("click", async () => {
      const request = {
        user_id: localStorage.getItem("userId"),
        recipe_id: this.recipeID
      }

      if (favorite.classList.contains("favourited")) {
        favorite.classList.remove("favourited");
        await fetch(`/api/recipe/removeFavourite`, {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Authorization": `${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        });

        favorite.textContent = "Add to favourites";
      }
      else {
        favorite.classList.add("favourited");
        await fetch(`/api/recipe/addFavourite`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Authorization": `${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        });

        favorite.textContent = "Remove from favourites";
      }


    });

    // Tags
    const tagsDiv = document.createElement("div");
    if (recipe.tags) {
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
    if (localStorage.getItem("userId") === "") {
      recipeSection.append(recipeImgContainer, tagsDiv, recipeInfo, recipeIngredients, recipeSteps);
    }
    else {
      recipeSection.append(recipeImgContainer, favouriteDiv, tagsDiv, recipeInfo, recipeIngredients, recipeSteps);
    }

    // Review section
    const reviewSection = document.createElement("section");
    reviewSection.className = 'review-section';

    // Review heading
    const reviewHeading = document.createElement("h2");
    reviewHeading.textContent = "Reviews";

    //Review form
    const reviewInput = document.createElement("textarea");
    reviewInput.className = "review-input";
    reviewInput.placeholder = "Add your review";

    const ratingSpan = document.createElement("span");
    const starArray = [];
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("span");
      star.className = "starClickable";
      if (i != 0)
        star.classList.add("starClickableEmpty");
      star.textContent = "star ";
      star.key = i + 1;

      star.addEventListener("click", () => {
        for (let k = 0; k < star.key; k++) {
          starArray[k].classList.remove("starClickableEmpty");
        }

        for (let k = star.key; k < 5; k++) {
          starArray[k].classList.add("starClickableEmpty");
        }

        this.stars = star.key;
      });

      star.addEventListener("mouseenter", () => {
        for (let k = 0; k < star.key; k++) {
          starArray[k].classList.remove("starClickableEmpty");
        }

        for (let k = star.key; k < 5; k++) {
          starArray[k].classList.add("starClickableEmpty");
        }
      });

      star.addEventListener("mouseleave", () => {
        for (let k = 0; k < this.stars; k++) {
          starArray[k].classList.remove("starClickableEmpty");
        }

        for (let k = this.stars; k < 5; k++) {
          starArray[k].classList.add("starClickableEmpty");
        }
      });

      starArray.push(star);
    }
    ratingSpan.append(...starArray);

    const submitBtn = document.createElement("button");
    submitBtn.className = "submitButton";
    submitBtn.textContent = "Submit review";

    submitBtn.addEventListener("click", async () => {
      const request = {
        review_message: reviewInput.value,
        review_rating: this.stars,
        user_id: localStorage.getItem("userId"),
        recipe_id: this.recipeID
      }

      if (request.review_message !== "") {
        await fetch(`/api/review/addReview`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Authorization": `${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        });

        this.getHtml();
      } else {
        window.alert("Please enter a review message");
      }

    });




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

      const date = new Date(review.time_created.substring(0, 10));

      usernameSpan.insertAdjacentHTML("beforeend", `<strong>${review.creator_username}</strong>`);
      dateSpan.className = "date";
      dateSpan.textContent = ` - ${date.toDateString()}`;

      starsFilledSpan.className = "star";
      for (let i = 0; i < review.review_rating; i++) {
        starsFilledSpan.textContent += "star ";
      }

      starsEmptySpan.className = "star starEmpty";
      for (let i = review.review_rating; i < 5; i++) {
        starsEmptySpan.textContent += "star ";
      }
      starsDiv.append(starsFilledSpan, starsEmptySpan);
      starsDiv.style.marginBottom = "1rem";

      messageSpan.textContent = review.review_message;
      messageSpan.style.display = "block";
      messageSpan.style.marginTop = "1rem";
      messageSpan.style.marginBottom = "1rem";

      reviewLi.append(starsDiv, usernameSpan, dateSpan, messageSpan);

      recipeReviews.appendChild(reviewLi);
    });

    // Append to review section
    if (localStorage.getItem("userId") === "") {
      reviewSection.append(reviewHeading, recipeReviews);
    }
    else {
      reviewSection.append(reviewHeading, reviewInput, ratingSpan, submitBtn, recipeReviews);
    }

    document.getElementById("main-content").replaceChildren(titleSection, recipeSection, reviewSection);
  }
}