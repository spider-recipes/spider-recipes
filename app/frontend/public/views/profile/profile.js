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
    // console.log(localStorage.getItem('username'));
    this.userID = localStorage.getItem("userId");
    // this.userID = 1;
  }

  async getHtml() {
    //Start loader
    const loader = document.createElement("div");
    loader.className = "loader";

    document.getElementById("main-content").replaceChildren(loader);

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

    // console.log(`token: ${localStorage.getItem('token')}`);

    let response = await fetch(`/api/user/getProfileInfo/${this.userID}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Authorization": `${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    const profileInfo = data.profileInfo[0];
    console.log(profileInfo);

    const profileSection = document.createElement("section");
    profileSection.className = "profile-section";

    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-container";

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
          "Authorization": `${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      }
    );
    data = await response.json();
    const favouritedRecipesExtended = data.userFavouritedRecipesExtended[0];
    console.log(favouritedRecipesExtended);

    // Get userCreatedRecipesExtended
    response = await fetch(
      `/api/recipe/getUserCreatedRecipeExtended/${this.userID}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Authorization": `${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      }
    );
    data = await response.json();
    const userCreatedRecipesExtended = data.userCreatedRecipeExtendedById[0];
    console.log(userCreatedRecipesExtended);

    loader.style.display = "none";

    const cardsContainer = document.createElement("ul");
    cardsContainer.id = "cards-container";
    let recipe_ids = [];

    console.log("First recipe ids:", recipe_ids);

    favouritedRecipesExtended.forEach((recipe) => {
      recipe_ids.push(recipe.recipe_id);
      console.log("fav recipe:", recipe);
      cardsContainer.appendChild(
        makeCard(
          recipe.recipe_image,
          recipe.recipe_name,
          recipe.avg_rating,
          "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ccabba-ea38-411f-a673-04f26b5e919c_980x980.jpeg",
          recipe.creator_username,
          recipe.time_created,
          recipe.recipe_id,
          true
        )
      );
    });

    console.log("Second recipe ids:", recipe_ids);

    userCreatedRecipesExtended.forEach((recipe) => {
      console.log(recipe);
      if (recipe.recipe_id in recipe_ids) {
        // do nothing

      } else {
        console.log("Not this recipe to the list");
        recipe_ids.push(recipe.recipe_id);

        cardsContainer.appendChild(
          makeCard(
            recipe.recipe_image,
            recipe.recipe_name,
            recipe.avg_rating,
            "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ccabba-ea38-411f-a673-04f26b5e919c_980x980.jpeg",
            recipe.creator_username,
            recipe.time_created,
            recipe.recipe_id,
            false
          )
        );

      }
    });

    profileSection.append(gridContainer, cardsContainer);

    document
      .getElementById("main-content")
      .replaceChildren(titleSection, profileSection);
  }
}
