export default function makeCard(

  imgSrc,
  recipeName,
  rating,
  userImgSrc,
  userName,
  dateCreated,
  key,
  favRecipes
) {
  const card = document.createElement("li");
  card.className = "card";
  card.href = `/recipe/${key}`;
  card.setAttribute("data-link", "");

  const recipeLink = document.createElement("a");
  recipeLink.href = `/recipe/${key}`;
  recipeLink.setAttribute("data-link", "");
  card.appendChild(recipeLink);

  // Image
  const imgDiv = document.createElement("div");
  imgDiv.className = "img-div";

  const recipeImg = document.createElement("img");
  recipeImg.src = imgSrc;
  recipeImg.href = `/recipe/${key}`;
  recipeImg.alt = `Image of ${recipeName}`;
  recipeImg.setAttribute("data-link", "");
  imgDiv.appendChild(recipeImg);
  recipeLink.appendChild(imgDiv);

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
  for (let i = 0; i < parseInt(rating); i++) {
    starsFilled.textContent += "star ";
  }

  const starsEmpty = document.createElement("span");
  starsEmpty.className = "icon";
  for (let i = parseInt(rating); i < 5; i++) {
    starsEmpty.textContent += "star ";
  }
  descriptionDiv.append(starsFilled, starsEmpty);

  // Favourite
  const favorite = document.createElement("span");
  favorite.className = "icon";
  favorite.href = `/recipe/${key}`;
  favorite.setAttribute("data-link", "");
  favorite.textContent = "favorite";

  if (favRecipes) {
    descriptionDiv.append(favorite);
  }

  const userDiv = document.createElement("div");

  // User image
  const userImage = document.createElement("img");
  userImage.src = userImgSrc;
  userDiv.append(userImage);

  // User name
  const userSpan = document.createElement("span");

  const userNameSpan = document.createElement("p");
  // userNameSpan.className = "p1";
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
