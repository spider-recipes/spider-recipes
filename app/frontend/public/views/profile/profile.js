import AbstractView from "../AbstractView.js";
import makeCard from "../shared/shared-methods.js";
// Retrieving data from local storage
// localStorage.getItem('userId');
// localStorage.getItem('token');
// localStorage.getItem('username');

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Spider Recipes | Profile");
    console.log(localStorage.getItem('username'));
    this.userID = params.id;
    this.userID = 1;
  }

  async getHtml() {
    // TITLE SECTION -----------------------------------------------------------------------------------------------------
    const titleSection = document.createElement("section");
    titleSection.className = "title-section";

    const titleHeading = document.createElement("h1");
    titleHeading.textContent = "Profile";

    const titleDesc = document.createElement("p");
    titleDesc.textContent =
      "This is your profile page. You can view your username and join date, as well as your favourited and your created recipes. You can also edit your username, and logout.";

    titleSection.append(titleHeading, titleDesc);

    // PROFILE SECTION -----------------------------------------------------------------------------------------------------

    let response = await fetch(`/api/user/getProfileInfo/${this.userID}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    const profileInfo = data.profileInfo[0];
    console.log(profileInfo);

    const profileSection = document.createElement("section");
    profileSection.className = "profile-section";

    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-container"

    // Username element
    const usernameHeading = document.createElement("div");
    usernameHeading.className = "profile-heading-left";
    
    // Username heading
    const profileHeadingName = document.createElement("h2");
    profileHeadingName.textContent = "Username";

    // Username span
    const usernameSpan = document.createElement("p");
    console.log(profileInfo[0].username);
    usernameSpan.textContent = profileInfo[0].username;

    usernameHeading.append(profileHeadingName, usernameSpan);

    // Joined date element
    const joinDateHeading = document.createElement("div");
    joinDateHeading.className = "profile-date-right";

    // Join date heading
    const joinDateHeadingName = document.createElement("h2");
    joinDateHeadingName.textContent = "Join date";

    // Join date span
    const joinDateSpan = document.createElement("p");
    console.log(profileInfo[0].created_date);
    joinDateSpan.textContent = profileInfo[0].created_date;

    joinDateHeading.append(joinDateHeadingName, joinDateSpan);

    // Fill grid container
    gridContainer.append(usernameHeading, joinDateHeading);

    // Get favouritedRecipesExtended
    response = await fetch(
      `/api/recipe/getFavouritedRecipesExtended/${this.userID}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    data = await response.json();
    const favouritedRecipesExtended = data.userFavouritedRecipesExtended[0];
    console.log(favouritedRecipesExtended);

    // // Get userCreatedRecipesExtended
    // response = await fetch(`/api/recipe/getFavouritedRecipesExtended/${this.userID}`, {
    //   method: "GET",
    //   mode: "cors",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // data = await response.json();
    // const favouritedRecipesExtended = data.userFavouritedRecipesExtended[0];
    // console.log(favouritedRecipesExtended);

    const cardsContainer = document.createElement("ul");
    cardsContainer.id = "cards-container";

    favouritedRecipesExtended.forEach((recipe) => {
      console.log("fav recipe:", recipe);
      cardsContainer.appendChild(
        makeCard(
          recipe.recipe_image,
          recipe.recipe_name,
          recipe.avg_rating,
          "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ccabba-ea38-411f-a673-04f26b5e919c_980x980.jpeg",
          recipe.creator_username,
          recipe.time_created,
          recipe.recipe_id
        )
      );
    });

    profileSection.append(gridContainer, cardsContainer);

    document.getElementById("main-content").replaceChildren(titleSection, profileSection);
    
  }

  // async getHtml() {
  //   const response = await fetch("/public/views/profile/index.html");
  //   const html = await response.text();
  //   document.getElementById("main-content").innerHTML = html;
  // }
}

// import AbstractView from "../AbstractView.js";
//
// export default class extends AbstractView
// {
//   constructor(params)
//   {
//     super(params);
//     this.recipeID = params.id;
//     this.setTitle("Spider Recipes | Recipe");
//   }

//   async getHtml()
//   {
//     let response = await fetch(`/api/recipe/getRecipeExtended/${this.recipeID}`, {
//       method: "GET",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//     let data = await response.json();
//     const recipe = data.recipeExtendedById[0][0];

//     response = await fetch(`/api/review/getReviews/${this.recipeID}`, {
//       method: "GET",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//     data = await response.json();
//     const reviews = data.reviewsForRecipe[0];

//     // Title section
//     const titleSection = document.createElement("section");
//     titleSection.className = "title-section";

//     // Back button
//     const backButton = document.createElement("a");
//     backButton.className = "back-arrow";
//     backButton.href = "/";
//     backButton.setAttribute("data-link", "");
//     backButton.textContent = "west";

//     // Recipe heading
//     const recipeHeading = document.createElement("h1");
//     recipeHeading.textContent = recipe.recipe_name;

//     // Recipe user
//     const recipeUser = document.createElement("span");
//     recipeUser.id = "recipe-user";
//     recipeUser.insertAdjacentHTML("beforeend", `Posted by <strong>${recipe.creator_username}</strong>`);

//     // Recipe date
//     const recipeDate = document.createElement("span");
//     recipeDate.id = "recipe-date";
//     const date = new Date(parseInt(recipe.time_created));
//     recipeDate.textContent = `Posted on ${date.toDateString()}`;

//     // Rating
//     const starsDiv = document.createElement("div");

//     const starsFilled = document.createElement("span");
//     starsFilled.className = "star";
//     for(let i = 0; i < parseInt(recipe.avg_rating); i++)
//     {
//       starsFilled.textContent += "star ";
//     }

//     const starsEmpty = document.createElement("span");
//     starsEmpty.className = "star starEmpty";
//     for(let i = parseInt(recipe.avg_rating); i < 5; i++)
//     {
//       starsEmpty.textContent += "star ";
//     }

//     starsDiv.append(starsFilled, starsEmpty);

//     // Append to title section
//     titleSection.append(backButton, recipeHeading, recipeUser, recipeDate, starsDiv);

//     // Recipe section
//     const recipeSection = document.createElement("section");
//     recipeSection.className = "recipe-section";

//     // Recipe img
//     const recipeImg = document.createElement("img");
//     recipeImg.id = "recipe-img";
//     recipeImg.src = recipe.recipe_image;
//     recipeImg.alt = "Picture of spider recipe";
//     const recipeImgContainer = document.createElement("div");
//     recipeImgContainer.className = "img-container";
//     recipeImgContainer.appendChild(recipeImg);

//     // Tags
//     const tagsDiv = document.createElement("div");
//     if(recipe.tags)
//     {
//       const tags = recipe.tags.split(",");
//       tagsDiv.className = "tags";
//       tags.forEach(tag => {
//         const tagSpan = document.createElement("span");
//         tagSpan.textContent = tag;
//         tagsDiv.appendChild(tagSpan);
//       });
//     }

//     // Recipe info
//     const recipeInfo = document.createElement("ul");
//     recipeInfo.className = "recipe-info";

//     const prepTime = document.createElement("li");
//     const prepTimeIcon = document.createElement("span");
//     prepTimeIcon.textContent = "restaurant_menu";
//     const prepTimeValue = document.createElement("span");
//     prepTimeValue.id = "preparation-time";
//     prepTimeValue.insertAdjacentHTML("beforeend", `<strong>Preparation time:</strong> ${recipe.recipe_preparation_time_minutes} minutes`);
//     prepTime.append(prepTimeIcon, prepTimeValue);

//     const cookTime = document.createElement("li");
//     const cookTimeIcon = document.createElement("span");
//     cookTimeIcon.textContent = "skillet";
//     const cookTimeValue = document.createElement("span");
//     cookTimeValue.id = "cooking-time";
//     cookTimeValue.insertAdjacentHTML("beforeend", `<strong>Cooking time:</strong> ${recipe.recipe_cooking_time_minutes} minutes`);
//     cookTime.append(cookTimeIcon, cookTimeValue);

//     const serves = document.createElement("li");
//     const servesIcon = document.createElement("span");
//     servesIcon.textContent = "restaurant";
//     const servesValue = document.createElement("span");
//     servesValue.id = "serves";
//     servesValue.insertAdjacentHTML("beforeend", `<strong>Serves:</strong> ${recipe.recipe_serves}`);
//     serves.append(servesIcon, servesValue);

//     recipeInfo.append(prepTime, cookTime, serves);

//     // Recipe ingredients
//     const recipeIngredients = document.createElement("ul");
//     recipeIngredients.className = "recipe-ingredients";
//     const ingredientHeading = document.createElement("h2");
//     ingredientHeading.textContent = "Ingredients";
//     recipeIngredients.appendChild(ingredientHeading);

//     recipe.recipe_ingredients.split(";").forEach(ingredient => {
//       const ingredientLi = document.createElement("li");
//       ingredientLi.textContent = ingredient;
//       recipeIngredients.appendChild(ingredientLi);
//     });

//     // Recipe steps
//     const recipeSteps = document.createElement("ol");
//     recipeSteps.className = "recipe-steps";
//     const stepsHeading = document.createElement("h2");
//     stepsHeading.textContent = "How to make";
//     recipeSteps.appendChild(stepsHeading);

//     recipe.recipe_steps.split(";").forEach(step => {
//       const stepLi = document.createElement("li");
//       stepLi.textContent = step;
//       recipeSteps.appendChild(stepLi);
//     });

//     // Append to recipe section
//     recipeSection.append(recipeImgContainer, tagsDiv, recipeInfo, recipeIngredients, recipeSteps);

//     // Review section
//     const reviewSection = document.createElement("section");
//     reviewSection.className = 'review-section';

//     // Review heading
//     const reviewHeading = document.createElement("h2");
//     reviewHeading.textContent = "Reviews";

//     // Recipe reviews
//     const recipeReviews = document.createElement("ul");
//     recipeReviews.id = "recipe-reviews";

//     reviews.forEach(review => {
//       const reviewLi = document.createElement("li");
//       const usernameSpan = document.createElement("span");
//       const dateSpan = document.createElement("span");
//       const starsFilledSpan = document.createElement("span");
//       const starsEmptySpan = document.createElement("span");
//       const starsDiv = document.createElement("div");
//       const messageSpan = document.createElement("span");

//       const date = new Date(parseInt(review.time_created));

//       usernameSpan.insertAdjacentHTML("beforeend", `<strong>${review.creator_username}</strong>`);
//       dateSpan.className = "date";
//       dateSpan.textContent = ` - ${date.toDateString()}`;

//       starsFilledSpan.className = "star";
//       for(let i = 0; i < parseInt(review.review_rating); i++)
//       {
//         starsFilledSpan.textContent += "star ";
//       }

//       starsEmptySpan.className = "star starEmpty";
//       for(let i = parseInt(review.review_rating); i < 5; i++)
//       {
//         starsEmptySpan.textContent += "star ";
//       }
//         starsDiv.append(starsFilledSpan, starsEmptySpan);

//         messageSpan.textContent = review.review_message;

//         reviewLi.append(usernameSpan, dateSpan, starsDiv, messageSpan);

//         recipeReviews.appendChild(reviewLi);
//     });

//     // Append to review section
//     reviewSection.append(reviewHeading, recipeReviews);

//     document.getElementById("main-content").replaceChildren(titleSection, recipeSection, reviewSection);
//   }
// }
// import AbstractView from "../AbstractView.js";

// export default class extends AbstractView
// {
//   constructor(params)
//   {
//     super(params);
//     this.setTitle("Spider Recipes | Home");
//     this.filters = [];
//   }

//   reveal()
//   {
//     let reveals = document.querySelectorAll(".card");
//     reveals.forEach(reveal =>
//     {
//       let windowHeight = window.innerHeight;
//       let revealTop = reveal.getBoundingClientRect().top;
//       let revealPoint = 150;

//       if(revealTop < windowHeight - revealPoint)
//       {
//         reveal.classList.add("active");
//       }
//     });
//   }

//   filter(e)
//   {
//     e.target.classList.toggle("active");
//     if(e.target.classList.value.includes("active"))
//     {
//       this.filters.push(e.target.textContent);
//     }
//     else
//     {
//       this.filters = this.filters.filter((element) => {
//         return element !== e.target.textContent;
//       });
//     }

//     this.renderFilteredRecipes(document.getElementById("search-input").value);
//   }

//   search(e)
//   {
//     this.renderFilteredRecipes(e.target.value);
//   }

//   renderFilteredRecipes(searchString)
//   {
//     let viewableRecipes = [];
//     let newNodes = [];
//     this.allRecipes.forEach(recipe => {
//       if(recipe.recipe_name.toLowerCase().includes(searchString.toLowerCase()) && this.filters.every(item => recipe.tags !== null ? recipe.tags.includes(item) : false))
//       {
//         viewableRecipes.push(recipe);
//       }
//     });

//     viewableRecipes.forEach(recipe => {
//       newNodes.push(this.makeCard(
//         "/public/images/spider-dish.png",
//         recipe.recipe_name,
//         recipe.avg_rating,
//         "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ccabba-ea38-411f-a673-04f26b5e919c_980x980.jpeg",
//         recipe.creator_username,
//         recipe.time_created,
//         recipe.recipe_id
//       ));
//     });

//     document.getElementById("cards-container").replaceChildren(...newNodes);
//   }

//   makeCard(imgSrc, recipeName, rating, userImgSrc, userName, dateCreated, key)
//   {
//     const card = document.createElement("li");
//     card.className = "card";
//     card.href = `/recipe/${key}`;
//     card.setAttribute("data-link", "");

//     const recipeLink = document.createElement("a");
//     recipeLink.href = `/recipe/${key}`;
//     recipeLink.setAttribute("data-link", "");
//     card.appendChild(recipeLink);

//     // Image
//     const recipeImg = document.createElement("img");
//     recipeImg.src = imgSrc;
//     recipeImg.href = `/recipe/${key}`;
//     recipeImg.alt = `Image of ${recipeName}`;
//     recipeImg.setAttribute("data-link", "");
//     recipeLink.appendChild(recipeImg);

//     // Description box
//     const descriptionDiv = document.createElement("div");
//     descriptionDiv.className = "description";
//     descriptionDiv.href = `/recipe/${key}`;
//     descriptionDiv.setAttribute("data-link", "");
//     recipeLink.appendChild(descriptionDiv);

//     // Recipe name
//     const recipeNameH4 = document.createElement("h4");
//     recipeNameH4.textContent = recipeName;
//     recipeNameH4.href = `/recipe/${key}`;
//     recipeNameH4.setAttribute("data-link", "");
//     descriptionDiv.appendChild(recipeNameH4);

//     // Rating
//     const starsFilled = document.createElement("span");
//     starsFilled.className = "icon";
//     starsFilled.href = `/recipe/${key}`;
//     starsFilled.setAttribute("data-link", "");
//     for(let i = 0; i < parseInt(rating); i++)
//     {
//       starsFilled.textContent += "star ";
//     }

//     const starsEmpty = document.createElement("span");
//     starsEmpty.className = "icon";
//     starsEmpty.href = `/recipe/${key}`;
//     starsEmpty.setAttribute("data-link", "");
//     for(let i = parseInt(rating); i < 5; i++)
//     {
//       starsEmpty.textContent += "star ";
//     }
//     descriptionDiv.append(starsFilled, starsEmpty);

//     // Favourite
//     const favorite = document.createElement("span");
//     favorite.className = "icon";
//     favorite.href = `/recipe/${key}`;
//     favorite.setAttribute("data-link", "");
//     favorite.textContent = "favorite";
//     descriptionDiv.append(favorite);

//     const userDiv = document.createElement("div");

//     // User image
//     const userImage = document.createElement("img");
//     userImage.src = userImgSrc;
//     userDiv.append(userImage);

//     // User name
//     const userSpan = document.createElement("span");

//     const userNameSpan = document.createElement("p");
//     userNameSpan.href = `/recipe/${key}`;
//     userNameSpan.setAttribute("data-link", "");
//     userNameSpan.textContent = userName;
//     userSpan.append(userNameSpan);

//     // Date created
//     const date = new Date(dateCreated);
//     const dateSpan = document.createElement("p");
//     dateSpan.href = `/recipe/${key}`;
//     dateSpan.setAttribute("data-link", "");
//     dateSpan.textContent = date.toDateString();
//     userSpan.append(dateSpan);

//     userDiv.append(userSpan);
//     descriptionDiv.append(userDiv);

//     return card;
//   }

//   async getHtml()
//   {
//     // Title section
//     const titleSection = document.createElement("section");
//     titleSection.className = "title-section";

//     // Title heading
//     const titleHeading = document.createElement("h1");
//     titleHeading.textContent = "Recipes";

//     // Title paragraph
//     const titleParagraph = document.createElement("p");
//     titleParagraph.textContent = "Explore our exquisite spider recipes, where delectable flavours and creative cooking techniques converge to spin a tale of culinary adventure.";

//     // Append to title section
//     titleSection.append(titleHeading, titleParagraph);

//     // Cards section
//     const cardsSection = document.createElement("section");
//     cardsSection.className = "cards-section";

//     // Search bar
//     const searchBar = document.createElement("div");
//     searchBar.className = "search-bar";

//     // Search span
//     const searchSpan = document.createElement("span");
//     searchSpan.textContent = "search";

//     // Search input
//     const searchInput = document.createElement("input");
//     searchInput.id = "search-input";
//     searchInput.inputType = "text";
//     searchInput.placeholder = "search"
//     searchInput.addEventListener("keyup", e => {
//       this.search(e);
//     });

//     // Append to search bar
//     searchBar.append(searchSpan, searchInput);

//     // Filters
//     const filtersDiv = document.createElement("div");
//     filtersDiv.className = "filters";

//     // Filter spans
//     const filters = ["Sweet", "Savory", "Bake", "Fry", "Favourites"];
//     filters.forEach(filter => {
//       const filterSpan = document.createElement("span");
//       filterSpan.className = "filter";
//       filterSpan.textContent = filter;
//       filterSpan.addEventListener("click", e => {
//         this.filter(e);
//       })
//       filtersDiv.appendChild(filterSpan);

//     });

//     // Cards container
//     const cardsContainer = document.createElement("ul");
//     cardsContainer.id = "cards-container";

//     // Append to card section
//     cardsSection.append(searchBar, filtersDiv, cardsContainer);

//     // Append to main
//     document.getElementById("main-content").replaceChildren(titleSection, cardsSection);

//     const response = await fetch("/api/recipe/getRecipesExtended", {
//       method: "GET",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });

//     const data = await response.json();
//     this.allRecipes = data.recipesExtended[0];
//     this.currentRecipes = this.allRecipes;

//     this.allRecipes.forEach(recipe => {
//       cardsContainer.appendChild(this.makeCard(
//         "/public/images/spider-dish.png",
//         recipe.recipe_name,
//         recipe.avg_rating,
//         "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ccabba-ea38-411f-a673-04f26b5e919c_980x980.jpeg",
//         recipe.creator_username,
//         recipe.time_created,
//         recipe.recipe_id
//       ))
//     });

//     //window.addEventListener("scroll", this.reveal);
//     //this.reveal();
//   }
// }
