const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sql = require('mssql');
require('dotenv').config(); // Load environment variables from .env file

const PORT = process.env.PORT || process.env.PORT_LOCAL || 80;

const db_connection_config = {
  server: process.env.DB_CONNECTION_STRING_NO_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'SpiderRecipes',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const app = express();

if (process.env.MODE === 'debug') {
  app.use(logger('dev')); // Middleware to log requests
}
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/public", express.static(path.resolve(__dirname, 'frontend', 'public'))); // Middleware to serve static files

// Backend routes
let apiRouter = require('./backend/controllers/api');
let recipeRouter = require('./backend/controllers/recipe-controller');
// Mount routers
app.use('/api', apiRouter);
app.use('/api/recipe', recipeRouter);

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

// async function executeQuery(connection_config, query) {
//   try {

//     const pool = await sql.connect(connection_config);
//     const result = await pool.request().query(query);

//     console.log(result.recordset);
//     await pool.close();

//   } catch (err) {
//     // Handle errors
//     console.error('This specific error:', err);
//   }
// }
// query1 = 'SELECT * FROM Recipes';
// query2 = 'SELECT * FROM Users';
// executeQuery(db_connection_config, query1);
// executeQuery(db_connection_config, query2);