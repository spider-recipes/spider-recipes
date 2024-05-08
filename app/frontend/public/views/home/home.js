import AbstractView from "../AbstractView.js";
// Retrieving the user object from local storage
const user = JSON.parse(localStorage.getItem('user'));


export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Spider Recipes | Home");
    console.log("user: ", user.userId);
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

  makeCard(imgSrc, recipeName, rating, userImgSrc, userName, dateCreated) {
    const card = document.createElement("li");
    card.className = "card";
    card.href = `/recipe/${recipeName}`;
    card.setAttribute("data-link", "");

    const recipeLink = document.createElement("a");
    recipeLink.href = `/recipe/${recipeName}`;
    recipeLink.setAttribute("data-link", "");
    card.appendChild(recipeLink);

    // Image
    const recipeImg = document.createElement("img");
    recipeImg.src = imgSrc;
    recipeImg.href = `/recipe/${recipeName}`;
    recipeImg.alt = `Image of ${recipeName}`;
    recipeImg.setAttribute("data-link", "");
    recipeLink.appendChild(recipeImg);

    // Description box
    const descriptionDiv = document.createElement("div");
    descriptionDiv.className = "description";
    recipeLink.appendChild(descriptionDiv);

    // Recipe name
    const recipeNameH4 = document.createElement("h4");
    recipeNameH4.innerHTML = recipeName;
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
    favorite.innerHTML = "favorite";
    descriptionDiv.append(favorite);

    const userDiv = document.createElement("div");

    // User image
    const userImage = document.createElement("img");
    userImage.src = userImgSrc;
    userDiv.append(userImage);

    // User name
    const userSpan = document.createElement("span");

    const userNameSpan = document.createElement("p");
    userNameSpan.innerHTML = userName;
    userSpan.append(userNameSpan);

    // Date created
    const dateSpan = document.createElement("p");
    dateSpan.innerHTML = dateCreated;
    userSpan.append(dateSpan);

    userDiv.append(userSpan);
    descriptionDiv.append(userDiv);

    return card;
  }

  async getHtml() {
    let response = await fetch("/public/views/home/index.html");
    const homeHtml = await response.text();

    document.getElementById("main-content").innerHTML = homeHtml;

    data = await response.json();

    for (let i = 1; i <= 20; i++) {
      document.getElementById("cards-container").appendChild(this.makeCard(
        "/public/images/spider-dish.png",
        `Spider recipe ${i}`,
        3,
        "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ccabba-ea38-411f-a673-04f26b5e919c_980x980.jpeg",
        "Gordon Ramsay",
        Date.now()
      ))
    }

    window.addEventListener("scroll", this.reveal);
    this.reveal();
  }
}