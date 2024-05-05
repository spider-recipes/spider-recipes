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

async function executeQuery(connection_config, query) {
    try {
  
      const pool = await sql.connect(connection_config);
      const result = await pool.request().query(query);
  
      console.log(result.recordset);
      await pool.close();
  
    } catch (err) {
      // Handle errors
      console.error('Error:', err);
    }
  }
  query1 = 'SELECT * FROM Recipes';
  query2 = 'SELECT * FROM Users';
  executeQuery(db_connection_config, query1);
  executeQuery(db_connection_config, query2);