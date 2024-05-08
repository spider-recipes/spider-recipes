import AbstractView from "../AbstractView.js";
// Retrieving the user object from local storage
const user = JSON.parse(localStorage.getItem('user'));


export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Spider Recipes | Profile");
    console.log("user: ", user.userId);
  }

  async getHtml() {
    const response = await fetch("/public/views/profile/index.html");
    const html = await response.text();
    document.getElementById("main-content").innerHTML = html;
  }
}