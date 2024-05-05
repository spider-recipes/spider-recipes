require('dotenv').config(); // Load environment variables from .env file

const db_connection_config = {
  server: 'spider-recipes-db.cnsrxqmoyvuz.eu-west-1.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'SpiderRecipes',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

module.exports = {
  db_connection_config
};
