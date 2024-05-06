import AbstractView from "../AbstractView.js";
const imageForm = document.querySelector("#imageForm")
const imageInput = document.querySelector("#imageInput")

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

    imageForm.addEventListener("submit", async event => {
      event.preventDefault();
      const file = imageInput.files[0];

      // get secure url from our server
      const { url } = await fetch("/api/create-recipe/putImage").then(res => res.json());
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
      document.body.appendChild(img);
    });
  }
}

