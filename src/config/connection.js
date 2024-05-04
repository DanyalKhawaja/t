var mysql = require('mysql2');
require('dotenv').config();
const { env } = require("process");
function Connection() {
  this.pool = null;

  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PWD,
      database: env.DB_NAME
    });
  };

  // this.acquire = function(callback) {
  //   this.pool.getConnection(function(err, connection) {
  //     callback(err, connection);
  //   });
  // };

  this.query = function(query, params, callback) {
    this.pool.getConnection(function(err, connection) {
      if (err){
        console.log(err.message);
        connection.release();
        callback(err, null);
      } else {
        connection.query(query, params, function(err, results){
          connection.release();
          callback(err, results);
        });
      }
    });
  };
}

module.exports = new Connection();
