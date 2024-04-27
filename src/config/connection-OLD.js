var mysql = require('mysql');

function Connection() {
  this.pool = null;

  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'cybers56_pip',
      password: 'Q1QHJg~(8kqt',
      database: 'cybers56_pip'
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
        connection.release();
        callback(err, null);
      } else {
        connection.query(query, params, function(err, results){
          connection.release();
          callback(null, results);
        });
      }
    });
  };
}

module.exports = new Connection();
