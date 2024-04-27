var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); // Load environment variables from .env file

const port = process.env.PORT || process.env.PORT_LOCAL || 80; // Port number

// Creating an Express app
var app = express();

if (process.env.MODE === 'debug') {
  app.use(logger('dev')); // Middleware to log requests
}
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');

// Mount routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
