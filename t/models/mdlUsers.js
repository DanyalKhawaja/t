var db = require('../config/connection');
var async = require('async');

var users = {

  getAll: function(req, res) {
			db.query('SELECT * FROM Users', null, function(err, result) {
				json = "{\"Users\": " + JSON.stringify(result) + "}";
				res.send(json);
			});
  },

  getOne: function(req, res) {
    var UserID = req.UserID;
    db.query('SELECT * FROM Users WHERE UserID = ?', UserID, function(err, result) {
      res(result);
    });
  },
  getOneByLP: function(UserName, UserPassword, res) {

    db.query('SELECT * FROM Users WHERE UserName = ? AND UserPassword = ?', [UserName, UserPassword], function(err, result) {

      res(result);
    });
  },
  getOneByLogin: function(UserName, res) {

    db.query('SELECT * FROM Users WHERE UserName = ?', [UserName], function(err, result) {
      res(result);
    });
  },
  create: function(req, res) {
    var NewUser = req.body;
    db.query('INSERT INTO Users SET ?', NewUser, function(err, result) {
      res(result);
    });
  },

  update: function(req, res) {
    var user = req.body || req[0];
    db.query('UPDATE Users SET ? WHERE UserID=?', [user, user.UserID], function(err, result) {
      //json = "{\"users\": " + JSON.stringify(result) + "}";
      res(result);
    });

  },

  delete: function(req, res) {
    var UserID = req.UserID || req[0].UserID;
    db.query('DELETE FROM Users WHERE UserID = ?', UserID, function(err, result) {
      res(result);
    });
  },

  wsPost: function(req, res) {

    var usersArray = req.body;
    var resJSON = {};
		async.each(usersArray, function(row, callback){
			users.getOne(row, function(result) {
				if (result.length > 0) {
					users.update(row, function(result) {
						resJSON[row[0].UserID] = result.affectedRows;
						callback();
					});
				} else {
					users.create(row, function(result) {
						resJSON[row[0].UserID] = result.affectedRows;
						callback();
					});
				}
			});
		},
		function (err){
			if (err){
				res.send(err.message);
			} else {
				res.send(resJSON);
			}
		});
  }
};


module.exports = users;
