import Home from "../views/home/home.js";
import Recipe from "../views/recipe/recipe.js";
import Profile from "../views/profile/profile.js";
import NotFound from "../views/not-found/not-found.js";
import CreateRecipe from "../views/create-recipe/create-recipe.js";
const fetchAuthConfig = () => fetch("/auth_config.json");

let auth0Client = null;

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

    localStorage.setItem('userId', response.user.user_id);
    localStorage.setItem('token', token);
    localStorage.setItem('username', authUser.nickname);
    return;
  }

  localStorage.setItem('userId', '');
  localStorage.setItem('token', '');
  localStorage.setItem('username', '');

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {

    await auth0Client.handleRedirectCallback().then(async () => {
      // Perform actions after successful login, such as refreshing the page
      window.location.reload();
      console.log("Redirect callback complete");
    }).catch(error => {
      console.error('Error during redirect callback:', error);
    });
    updateUI();
    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, "/");
  }

}

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

const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  const logout = document.getElementById("btn-logout");
  const login = document.getElementById("btn-login");

  if (isAuthenticated) {
    console.log("isAuthenticated: ", isAuthenticated);
    login.style.display = 'none';
    logout.style.display = 'block';

  } else {
    console.log("isAuthenticated: ", isAuthenticated);
    login.style.display = 'block';
    logout.style.display = 'none';
  }
};

const loginLink = document.getElementById('btn-login');
const logoutLink = document.getElementById('btn-logout');

loginLink.addEventListener("click", async function (event) {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
});

logoutLink.addEventListener("click", async function (event) {
  await auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
});

async function goToLogin() {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
}

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



