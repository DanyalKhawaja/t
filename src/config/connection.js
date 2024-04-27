var mysql = require('mysql');

function Connection() {
  this.pool = null;

  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'cybers56_pip',
      password: 'Q1QHJg~(8kqt',
      database: 'cybers56_pip02'
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
