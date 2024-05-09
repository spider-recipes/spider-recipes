import AbstractView from "../AbstractView.js";
// Retrieving data from local storage
// localStorage.getItem('userId');
// localStorage.getItem('token');
// localStorage.getItem('username');

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Spider Recipes | Create Recipe");
  }

  async getHtml() {
    const response = await fetch("/public/views/create-recipe/index.html");
    const html = await response.text();
    document.getElementById("main-content").innerHTML = html;
  }
  
  async initScripts() {
    const imageForm = document.querySelector("#imageForm");
    const imageInput = document.querySelector("#imageInput");

    const recipeForm = document.querySelector("#recipeForm");
    // const recipeInput = document.querySelector("#recipeInput");

    imageForm.addEventListener("submitImage", async event => {
      event.preventDefault();
      const file = imageInput.files[0];

      // get secure url from our server
      const { url } = await fetch("/api/recipe/putImage").then(res => res.json());
      console.log(url);
      // post the image directly to the s3 bucket
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: file
      });

      const imageUrl = url.split('?')[0];
      console.log(imageUrl);

      // post request to my server to store any extra data

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = 'PLACEHOLDER';
      document.getElementById('imageContainer').appendChild(img);
    });

    recipeForm.addEventListener("submitRecipe", async event => {
      //get form info
      //call api
    });

    document.getElementById("addStepButton").addEventListener("click", (e) => {
      e.preventDefault();
      // Create a new input element
      var textBox = document.createElement('input');
      textBox.type = "text";
      textBox.name = "addStep";
      textBox.placeholder = "Step...";
      textBox.className = "stepTextBox";

      // Create a button to remove the textbox
      var removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "removeStepButton";
      removeButton.onclick = function() {
        textBox.remove();
        removeButton.remove();
    };

      // Create a div to contain the textbox and the remove button
      var container = document.createElement("div");
      container.appendChild(textBox);
      container.appendChild(removeButton);

      // Append the new input element to the container
      document.getElementById("addStepContainer").appendChild(container);
    });

    document.getElementById("addIngredientButton").addEventListener("click", (e) => {
      e.preventDefault();
      // Create a new input element
      var textBox = document.createElement('input');
      textBox.type = "text";
      textBox.name = "addIngredient";
      textBox.placeholder = "Ingredient...";
      textBox.className = "ingredientTextBox";

      // Create a button to remove the textbox
      var removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "removeStepButton";
      removeButton.onclick = function() {
        textBox.remove();
        removeButton.remove();
    };

      // Create a div to contain the textbox and the remove button
      var container = document.createElement("div");
      container.appendChild(textBox);
      container.appendChild(removeButton);

      // Append the new input element to the container
      document.getElementById("addIngredientContainer").appendChild(container);
    });
  }
}

