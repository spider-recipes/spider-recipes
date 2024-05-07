const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sql = require('mssql');
require('dotenv').config({override: true}); // Load environment variables from .env file

const PORT = process.env.PORT || process.env.PORT_LOCAL || 80;

const app = express();

if (process.env.MODE === 'debug') {
  app.use(logger('dev')); // Middleware to log requests
}
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/public", express.static(path.resolve(__dirname, 'frontend', 'public'))); // Middleware to serve static files

// Backend routes
let apiRouter = require('./backend/handlers/api');
let recipeRouter = require('./backend/handlers/recipe-handler');
let tagRouter = require('./backend/handlers/tag-handler');
let recipeTagRouter = require('./backend/handlers/recipe-tag-handler');
let userRouter = require('./backend/handlers/user-handler');
let reviewRouter = require('./backend/handlers/review-handler');
// Mount routers
app.use('/api', apiRouter);
app.use('/api/recipe', recipeRouter);
app.use('/api/tag', tagRouter);
app.use('/api/recipeTag', recipeTagRouter);
app.use('/api/user', userRouter);
app.use('/api/review', reviewRouter);

app.get("/api/recipes", (request, response) => {

});

//All other routes route to the single page application
app.get("/*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, "frontend", "public", "views", "404.html"));
// });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

