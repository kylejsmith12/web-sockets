// db/index.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "text-comparisons",
  password: "postgres",
  port: 5432,
});

module.exports = pool;
