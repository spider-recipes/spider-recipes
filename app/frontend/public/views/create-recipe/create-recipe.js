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
    let response = await fetch("/public/views/create-recipe/index.html");
    const html = await response.text();

    document.getElementById("main-content").innerHTML = html;

    response = await fetch("/api/tag/getTags", {
      method: "GET",
      mode: "cors",
      headers: {
        "Authorization": `${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    this.tags = data.tags[0];

    // Create upload button
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submitRecipe");
    submitButton.textContent = "Submit";

    // Enable upload button and show image preview when file changes
    const imageInput = document.getElementById("image-input");
    imageInput.addEventListener("change", () => {
      const file = imageInput.files;
      if(file)
      {
        const fileReader = new FileReader();
        const preview = document.getElementById("image-preview");
        fileReader.onload = event => {
          preview.setAttribute("src", event.target.result);
        }
        fileReader.readAsDataURL(file[0]);
        
        //document.getElementById("image-form").appendChild(uploadButton);
      }
      else
      {
       // document.getElementById("image-form").removeChild(uploadButton);
      }
    });

    // Add steps dynamically
    document.getElementById("addStepButton").addEventListener("click", (e) => {
      e.preventDefault();
      // Create a new input element
      const textBox = document.createElement('input');
      textBox.type = "text";
      textBox.name = "addStep";
      textBox.placeholder = "Step...";
      textBox.className = "stepTextBox";
      textBox.required = true;

      // Create a button to remove the textbox
      const removeButton = document.createElement("span");
      removeButton.textContent = "x";
      removeButton.className = "removeStepButton";
      removeButton.addEventListener("click", () => {
        textBox.remove();
        removeButton.remove();
      });

      // Create a div to contain the textbox and the remove button
      const container = document.createElement("div");
      container.appendChild(textBox);
      container.appendChild(removeButton);

      // Append the new input element to the container
      document.getElementById("addStepContainer").appendChild(container);
    });

    // Add tags
    this.tags.forEach(tag => {
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.id = `tag${tag.tag_id}`;

      const label = document.createElement("label");
      label.textContent = tag.tag_name;
      label.className = "checkbox-label";
      label.setAttribute("for", `tag${tag.tag_id}`);

      const container = document.createElement("div");
      container.append(checkbox, label)

      document.getElementById("tags").append(container);
    });
    
    // Add ingredients dynamically
    document.getElementById("addIngredientButton").addEventListener("click", (e) => {
      e.preventDefault();
      // Create a new input element
      const textBox = document.createElement('input');
      textBox.type = "text";
      textBox.name = "addIngredient";
      textBox.placeholder = "Ingredient...";
      textBox.className = "ingredientTextBox";
      textBox.required = true;

      // Create a button to remove the textbox
      const removeButton = document.createElement("span");
      removeButton.textContent = "x";
      removeButton.className = "removeStepButton";
      removeButton.addEventListener("click", () => {
        textBox.remove();
        removeButton.remove();
      });

      // Create a div to contain the textbox and the remove button
      const container = document.createElement("div");
      container.appendChild(textBox);
      container.appendChild(removeButton);

      // Append the new input element to the container
      document.getElementById("addIngredientContainer").appendChild(container);
    });

    const recipeForm = document.getElementById("recipe-form");

    recipeForm.addEventListener("submit", async event => {
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

      const ingredients = document.getElementsByClassName("ingredientTextBox");
      let ingredientsString = "";
      Array.from(ingredients).forEach(ingredient => {
        ingredientsString += ingredient.value + ";";
      });

      const steps = document.getElementsByClassName("ingredientTextBox");
      let stepsString = "";
      Array.from(steps).forEach(step => {
        stepsString += step.value + ";";
      });

      const request = {
        "recipe_name": recipeForm.elements["recipeName"].value,
        "recipe_ingredients": ingredientsString,
        "recipe_steps": stepsString,
        "recipe_preparation_time_minutes": recipeForm.elements["prepTime"].value,
        "recipe_cooking_time_minutes": recipeForm.elements["cookTime"].value,
        "recipe_serves": recipeForm.elements["servingSize"].value,
        "recipe_image": imageUrl,
        "deleted": false,
        "user_id": localStorage.getItem("userId")
      };

      await fetch(`/api/recipe/addRecipe`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Authorization": `${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });

      console.log(request);
    });
  }
  
  async initScripts() {
  }
}

