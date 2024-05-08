import AbstractView from "../AbstractView.js";
// Retrieving data from local storage
// localStorage.getItem('userId');
// localStorage.getItem('token');
// localStorage.getItem('username');

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Spider Recipes | Home");
    this.filters = [];
    console.log(localStorage.getItem('username'));
  }

  reveal() {
    let reveals = document.querySelectorAll(".card");
    reveals.forEach(reveal => {
      let windowHeight = window.innerHeight;
      let revealTop = reveal.getBoundingClientRect().top;
      let revealPoint = 150;

      if (revealTop < windowHeight - revealPoint) {
        reveal.classList.add("active");
      }
    });
  }

  filter(e) {
    e.target.classList.toggle("active");
    if (e.target.classList.value.includes("active")) {
      this.filters.push(e.target.textContent);
    }
    else {
      this.filters = this.filters.filter((element) => {
        return element !== e.target.textContent;
      });
    }

    this.renderFilteredRecipes(document.getElementById("search-input").value);
  }

  search(e) {
    this.renderFilteredRecipes(e.target.value);
  }

  renderFilteredRecipes(searchString) {
    let viewableRecipes = [];
    let newNodes = [];
    this.allRecipes.forEach(recipe => {
      if (recipe.recipe_name.toLowerCase().includes(searchString.toLowerCase()) && this.filters.every(item => recipe.tags !== null ? recipe.tags.includes(item) : false)) {
        viewableRecipes.push(recipe);
      }
    });

    viewableRecipes.forEach(recipe => {
      newNodes.push(this.makeCard(
        "/public/images/spider-dish.png",
        recipe.recipe_name,
        recipe.avg_rating,
        "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ccabba-ea38-411f-a673-04f26b5e919c_980x980.jpeg",
        recipe.creator_username,
        recipe.time_created,
        recipe.recipe_id
      ));
    });

    document.getElementById("cards-container").replaceChildren(...newNodes);
  }

  makeCard(imgSrc, recipeName, rating, userImgSrc, userName, dateCreated, key) {
    const card = document.createElement("li");
    card.className = "card";
    card.href = `/recipe/${key}`;
    card.setAttribute("data-link", "");

    const recipeLink = document.createElement("a");
    recipeLink.href = `/recipe/${key}`;
    recipeLink.setAttribute("data-link", "");
    card.appendChild(recipeLink);

    // Image
    const recipeImg = document.createElement("img");
    recipeImg.src = imgSrc;
    recipeImg.href = `/recipe/${key}`;
    recipeImg.alt = `Image of ${recipeName}`;
    recipeImg.setAttribute("data-link", "");
    recipeLink.appendChild(recipeImg);

    // Description box
    const descriptionDiv = document.createElement("div");
    descriptionDiv.className = "description";
    descriptionDiv.href = `/recipe/${key}`;
    descriptionDiv.setAttribute("data-link", "");
    recipeLink.appendChild(descriptionDiv);

    // Recipe name
    const recipeNameH4 = document.createElement("h4");
    recipeNameH4.textContent = recipeName;
    recipeNameH4.href = `/recipe/${key}`;
    recipeNameH4.setAttribute("data-link", "");
    descriptionDiv.appendChild(recipeNameH4);

    // Rating
    const starsFilled = document.createElement("span");
    starsFilled.className = "icon";
    for (let i = 0; i < rating; i++) {
      starsFilled.innerHTML += "star ";
    }

    const starsEmpty = document.createElement("span");
    starsEmpty.className = "icon";
    for (let i = rating; i < 5; i++) {
      starsEmpty.innerHTML += "star ";
    }
    descriptionDiv.append(starsFilled, starsEmpty);

    // Favourite
    const favorite = document.createElement("span");
    favorite.className = "icon";
    favorite.href = `/recipe/${key}`;
    favorite.setAttribute("data-link", "");
    favorite.textContent = "favorite";
    descriptionDiv.append(favorite);

    const userDiv = document.createElement("div");

    // User image
    const userImage = document.createElement("img");
    userImage.src = userImgSrc;
    userDiv.append(userImage);

    // User name
    const userSpan = document.createElement("span");

    const userNameSpan = document.createElement("p");
    userNameSpan.href = `/recipe/${key}`;
    userNameSpan.setAttribute("data-link", "");
    userNameSpan.textContent = userName;
    userSpan.append(userNameSpan);

    // Date created
    const date = new Date(dateCreated);
    const dateSpan = document.createElement("p");
    dateSpan.href = `/recipe/${key}`;
    dateSpan.setAttribute("data-link", "");
    dateSpan.textContent = date.toDateString();
    userSpan.append(dateSpan);

    userDiv.append(userSpan);
    descriptionDiv.append(userDiv);

    return card;
  }

  async getHtml() {
    // Title section
    const titleSection = document.createElement("section");
    titleSection.className = "title-section";

    // Title heading
    const titleHeading = document.createElement("h1");
    titleHeading.textContent = "Recipes";

    // Title paragraph
    const titleParagraph = document.createElement("p");
    titleParagraph.textContent = "Explore our exquisite spider recipes, where delectable flavours and creative cooking techniques converge to spin a tale of culinary adventure.";

    // Append to title section
    titleSection.append(titleHeading, titleParagraph);

    // Cards section
    const cardsSection = document.createElement("section");
    cardsSection.className = "cards-section";

    // Search bar
    const searchBar = document.createElement("div");
    searchBar.className = "search-bar";

    // Search span
    const searchSpan = document.createElement("span");
    searchSpan.textContent = "search";

    // Search input
    const searchInput = document.createElement("input");
    searchInput.id = "search-input";
    searchInput.inputType = "text";
    searchInput.placeholder = "search"
    searchInput.addEventListener("keyup", e => {
      this.search(e);
    });

    // Append to search bar
    searchBar.append(searchSpan, searchInput);

    // Filters
    const filtersDiv = document.createElement("div");
    filtersDiv.className = "filters";

    // Filter spans
    const filters = ["Sweet", "Savory", "Bake", "Fry", "Favourites"];
    filters.forEach(filter => {
      const filterSpan = document.createElement("span");
      filterSpan.className = "filter";
      filterSpan.textContent = filter;
      filterSpan.addEventListener("click", e => {
        this.filter(e);
      })
      filtersDiv.appendChild(filterSpan);

    });

    // Cards container
    const cardsContainer = document.createElement("ul");
    cardsContainer.id = "cards-container";

    // Append to card section
    cardsSection.append(searchBar, filtersDiv, cardsContainer);

    // Append to main
    document.getElementById("main-content").replaceChildren(titleSection, cardsSection);

    const response = await fetch("/api/recipe/getRecipesExtended", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    this.allRecipes = data.recipesExtended[0];
    this.currentRecipes = this.allRecipes;

    this.allRecipes.forEach(recipe => {
      cardsContainer.appendChild(this.makeCard(
        "/public/images/spider-dish.png",
        recipe.recipe_name,
        recipe.avg_rating,
        "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ccabba-ea38-411f-a673-04f26b5e919c_980x980.jpeg",
        recipe.creator_username,
        recipe.time_created,
        recipe.recipe_id
      ))
    });

    //window.addEventListener("scroll", this.reveal);
    //this.reveal();
  }
}