import Home from "../views/home/home.js";
import Recipe from "../views/recipe/recipe.js";
import Profile from "../views/profile/profile.js";
import NotFound from "../views/not-found/not-found.js";
import CreateRecipe from "../views/create-recipe/create-recipe.js";

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
    { path: "/create-recipe", view: CreateRecipe },
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
      navigateTo(e.target.href);
    }
  })
  router();
});