var { getPool } = require('../config/db.js')

async function getAllTags() {
  try {
    const pool = await getPool();
    const tags = await pool.request().query("SELECT * FROM Tags");
    return tags.recordsets;
  } catch (error) {
    console.log(error);
    return [];
  }
}


module.exports = {
  getAllTags,
};