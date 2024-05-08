const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { join } = require("path");
require('dotenv').config(); // Load environment variables from .env file
const jwtCheck = require('./auth-middleware.js');

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

// Endpoint to serve the configuration file
app.get("/auth_config.json", (req, res) => {
  console.log("Sending auth_config.json");
  console.log(join(__dirname, "auth_config.json"));
  res.sendFile(join(__dirname, "auth_config.json"));
});

//All other routes route to the single page application
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }

  next(err, req, res);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

