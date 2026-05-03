const mysql = require("mysql2/promise");
const config = require("./config");

const pool = mysql.createPool(config.db);

pool
  .getConnection()
  .then(conn => {
    conn.release();
    console.log("MySQL pool ready");
  })
  .catch(err => {
    console.error("MySQL pool error:", err.message);
  });

module.exports = pool;
