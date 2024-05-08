import Home from "../views/home/home.js";
import Recipe from "../views/recipe/recipe.js";
import Profile from "../views/profile/profile.js";
import NotFound from "../views/not-found/not-found.js";
import CreateRecipe from "../views/create-recipe/create-recipe.js";
const fetchAuthConfig = () => fetch("/auth_config.json");

let auth0Client = null;
var user = null;
// {userId: 12,
//  username: "test"
//  authToken: "fsdfsdgfsdgfsdg"
//  }

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();
  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      audience: config.audience
    }
  });
};

window.onload = async () => {
  await configureClient();
  updateUI();
  const isAuthenticated = await auth0Client.isAuthenticated();
  if (isAuthenticated) {
    const token = await auth0Client.getTokenSilently();
    const authUser = await auth0Client.getUser();
    const response = await fetch("/api/user/createUser", {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: `${authUser.nickname}`,
        authToken: token,
        createdDate: new Date().toISOString() // Convert date to ISO string
      }),
    }).then(res => res.json());

    user = {
      userId: response.user.user_id,
      username: authUser.nickname,
      authToken: token
    }

    console.log("user: ", user);

    // Storing the user object in local storage
    localStorage.setItem('user', JSON.stringify(user));

    return;
  }

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {

    await auth0Client.handleRedirectCallback();
    updateUI();
    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, "/");
  }
  user = null;
}

const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;

  if (isAuthenticated) {
    document.getElementById("gated-content").classList.remove("hidden");

    document.getElementById(
      "ipt-access-token"
    ).innerHTML = await auth0Client.getTokenSilently();

  } else {
    document.getElementById("gated-content")?.classList.add("hidden");
  }
};

const loginLink = document.querySelector('a[href="/login1/"]');
const logoutLink = document.querySelector('a[href="/logout1/"]');

loginLink.addEventListener("click", async function (event) {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
});

logoutLink.addEventListener("click", async function (event) {
  auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
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



