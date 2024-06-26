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
      "This is your profile page. You can view your username and join date, as well as your favourited and your created recipes.";

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
    const usernameSpan = document.createElement("div");
    usernameSpan.className = "p1";
    usernameSpan.textContent = profileInfo[0].username;

    usernameHeading.append(profileHeadingName, usernameSpan);

    // Joined date element
    const joinDateHeading = document.createElement("div");
    joinDateHeading.className = "profile-date-right";

    // Join date heading
    const joinDateHeadingName = document.createElement("h2");
    joinDateHeadingName.textContent = "Join date";

    // Join date span
    const joinDateSpan = document.createElement("div");
    joinDateSpan.className = "p1";
    joinDateSpan.textContent = profileInfo[0].created_date.substr(0, 10);

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

    loader.style.display = "none";

    const cardsContainer = document.createElement("ul");
    cardsContainer.id = "cards-container";
    let recipe_ids = [];

    favouritedRecipesExtended.forEach((recipe) => {
      recipe_ids.push(recipe.recipe_id);
      cardsContainer.appendChild(
        makeCard(
          recipe.recipe_image,
          recipe.recipe_name,
          recipe.avg_rating,
          "/public/images/chef-master.jpg",
          recipe.creator_username,
          recipe.time_created,
          recipe.recipe_id,
          true
        )
      );
    });

    userCreatedRecipesExtended.forEach((recipe) => {
      if (recipe.recipe_id in recipe_ids) {
        // do nothing

      } else {
        recipe_ids.push(recipe.recipe_id);

        cardsContainer.appendChild(
          makeCard(
            recipe.recipe_image,
            recipe.recipe_name,
            recipe.avg_rating,
            "/public/images/chef-master.jpg",
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
