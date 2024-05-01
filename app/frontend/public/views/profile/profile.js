import AbstractView from "../AbstractView.js";

export default class extends AbstractView
{
  constructor(params)
  {
    super(params);
    this.setTitle("Spider Recipes | Profile");
  }

  async getHtml()
  {
    const response = await fetch("/public/views/profile/index.html");
    const html = await response.text();
    document.getElementById("main-content").innerHTML = html;
  }
}