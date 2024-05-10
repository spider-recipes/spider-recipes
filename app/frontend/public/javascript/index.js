import Home from "../views/home/home.js";
import Recipe from "../views/recipe/recipe.js";
import Profile from "../views/profile/profile.js";
import NotFound from "../views/not-found/not-found.js";
import CreateRecipe from "../views/create-recipe/create-recipe.js";

window.onload = async () => {
  await configureClient();
  await updateUI();
}

const configureClient = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const paramValue = urlParams.get('code');

  if (paramValue) {
    const response = await fetch("/api/auth/getJwt", {
      method: 'GET',
      headers: {
        'Token': `${paramValue}`,
        'Content-Type': 'application/json'
      }
    })

    const userDetails = await response.json();

    localStorage.setItem('token', userDetails.token);
    localStorage.setItem('username', userDetails.username);
    localStorage.setItem('userId', userDetails.userId);
    window.location.href = "/";
  }
};

const updateUI = async () => {
  const logout = document.getElementById("btn-logout");
  const login = document.getElementById("btn-login");
  const profile = document.getElementById("btn-profile");
  const create_recipe = document.getElementById("btn-create-recipe");

  if (localStorage.getItem('token') !== '' && localStorage.getItem('token') !== null) {
    console.log("isAuthenticated: ", true);
    login.style.display = 'none';
    logout.style.display = 'block';
    profile.style.display = 'block';
    create_recipe.style.display = 'block';

  } else {
    console.log("isAuthenticated: ", false);
    login.style.display = 'block';
    logout.style.display = 'none';
    profile.style.display = 'none';
    create_recipe.style.display = 'none';
  }
};

const loginLink = document.getElementById('btn-login');
const logoutLink = document.getElementById('btn-logout');

loginLink.addEventListener("click", async function (event) {
  const giturl = 'https://github.com/login/oauth/authorize?client_id=Ov23liSccSMzhCE6OZ1n'
  window.location.href = giturl;
});

logoutLink.addEventListener("click", async function (event) {
  localStorage.setItem('userId', '');
  localStorage.setItem('token', '');
  localStorage.setItem('username', '');

  window.location.href = "/";
});

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

  return Object.fromEntries(keys.map((key, i) => {
    return [key, values[i]];
  }));
}

const router = async () => {
  const routes = [
    { path: "/not-found", view: NotFound },
    { path: "/", view: Home },
    { path: "/recipe/:id", view: Recipe },
    { path: "/profile", view: Profile },
    { path: "/create-recipe", view: localStorage.getItem('token') === '' ? Home : CreateRecipe },
  ];

  const viewMatches = routes.map(route => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path))
    }
  });

  let match = viewMatches.find(viewMatch => viewMatch.result !== null);

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname]
    };
  }

  const view = new match.route.view(getParams(match));
  await view.getHtml();
  await view.initScripts();
}

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      document.getElementById("nav-links").classList.remove("visible");
      window.scrollTo(0, 0);
      navigateTo(e.target.href);
    }
  })
  router();
});

document.getElementById("menu").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("visible");
});



