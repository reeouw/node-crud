const mysql = require("mysql");
const dbConfig = require("./config.js");

var connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements: true,
});

connection.getConnection(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});

module.exports = connection;
