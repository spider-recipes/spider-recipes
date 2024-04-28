var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); // Load environment variables from .env file

const PORT = process.env.PORT || process.env.PORT_LOCAL || 80;

var app = express();

if (process.env.MODE === 'debug') {
  app.use(logger('dev')); // Middleware to log requests
}
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Middleware to serve static files

// Routers
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// Mount routers
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
  console.log(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
