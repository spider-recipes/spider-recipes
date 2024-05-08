import AbstractView from "../AbstractView.js";
// Retrieving data from local storage
// localStorage.getItem('userId');
// localStorage.getItem('token');
// localStorage.getItem('username');

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Spider Recipes | Profile");
    console.log(localStorage.getItem('username'));
  }

  async getHtml() {
    const response = await fetch("/public/views/profile/index.html");
    const html = await response.text();
    document.getElementById("main-content").innerHTML = html;
  }
}