import AbstractView from "../AbstractView.js";

export default class extends AbstractView
{
  constructor(params)
  {
    super(params);
    this.recipeID = params.id;
    this.setTitle("Spider Recipes | Recipe ");
  }

  async getHtml()
  {
    const response = await fetch("/public/views/recipe/index.html");
    const html = await response.text();
    document.getElementById("main-content").innerHTML = html;
    document.getElementById("recipe-id").innerHTML = this.recipeID;
  }
}