var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
	port: "6033",
	database: "cybers56_pip02"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
