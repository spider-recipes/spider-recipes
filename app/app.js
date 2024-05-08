const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sql = require('mssql');
require('dotenv').config(); // Load environment variables from .env file
// const { auth } = require('express-openid-connect');
// var UserService = require('./backend/services/user-service.js');

// const config = {
//   authRequired: process.env.AUTHREQUIRED, //Set to false for dev and true for production
//   auth0Logout: true,
//   secret: process.env.SECRET,
//   baseURL: process.env.BASEURL,
//   clientID: process.env.CLIENTID,
//   clientSecret: process.env.CLIENTSECRET,
//   issuerBaseURL: process.env.ISSUER,
//   authorizationParams: {
//     response_type: 'code', // This requires you to provide a client secret
//   }
// };

const PORT = process.env.PORT || process.env.PORT_LOCAL || 80;

const app = express();

if (process.env.MODE === 'debug') {
  app.use(logger('dev')); // Middleware to log requests
}
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/public", express.static(path.resolve(__dirname, 'frontend', 'public'))); // Middleware to serve static files
// app.use(auth(config)); // Middleware to authenticate users

// Backend routes
let apiRouter = require('./backend/handlers/api');
let recipeRouter = require('./backend/handlers/recipe-handler');
let tagRouter = require('./backend/handlers/tag-handler');
let recipeTagRouter = require('./backend/handlers/recipe-tag-handler');
let userRouter = require('./backend/handlers/user-handler');
let reviewRouter = require('./backend/handlers/review-handler');
// let authRouter = require('./backend/handlers/auth-handler');

// Mount routers
app.use('/api', apiRouter);
app.use('/api/recipe', recipeRouter);
app.use('/api/tag', tagRouter);
app.use('/api/recipeTag', recipeTagRouter);
app.use('/api/user', userRouter);
app.use('/api/review', reviewRouter);
// app.use('/api/auth', authRouter);

//All other routes route to the single page application
app.get("/*", async (req, res) => {
  // if (req.oidc.isAuthenticated()) {
  //   const user = {
  //     username: req.oidc.user.nickname,
  //     authToken: req.oidc.accessToken.access_token,
  //     createdDate: '2024-05-07T12:00:00Z'
  //   }
  //   console.log(user);
  //   await UserService.createUser(user);
  // }
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, "frontend", "public", "views", "404.html"));
// });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

