var db = require('../config/connection');
var async = require('async');
var ByteBuffer = require('byte-buffer');

var mdlUsersFP = {

  getAll: function(req, res) {
      var lastSyncDate = req.params.lastSyncDate || "01-01-1970";
			db.query('SELECT * FROM UsersFP WHERE CreateDate > ? OR UpdateDate > ?', [lastSyncDate, lastSyncDate], function(result, err) {
        if (err){
          console.log(err.message);
        }
        if (result[0]) {
          result[0].LeftHFinger = result[0].LeftHFinger.toString('base64');
          result[0].RightHFinger = result[0].RightHFinger.toString('base64');
          result[0].LeftHTemplate = result[0].LeftHTemplate.toString('base64');
          result[0].RightHTemplate = result[0].RightHTemplate.toString('base64');
        }
				json = "{\"UsersFP\": " + JSON.stringify(result) + "}";
				res.send(json);
			});
  },

  getOne: function(req, res) {
    var CNIC = req.CNIC || req[0].CNIC;
    db.query('SELECT * FROM UsersFP WHERE CNIC = ?', CNIC, function(result, err) {
      res(result);
    });
  },

  create: function(req, res) {
    var UsersFP = req.body;
    db.query('INSERT INTO UsersFP SET ?', UsersFP, function(result, err) {
      res(result);
    });
  },

  update: function(req, res) {
    var UsersFP = req.body || req[0];
    db.query('UPDATE UsersFP SET ? WHERE CNIC=?', [UsersFP, UsersFP.CNIC], function(result, err) {
      res(result);
    });

  },

  delete: function(req, res) {
    var CNIC = req.CNIC || req[0].CNIC;
    db.query('DELETE FROM UsersFP WHERE CNIC = ?', CNIC, function(result, err) {
      res(result);
    });
  },

  wsPost: function(req, res) {
    //console.log(req.body);
    var dataArray = req.body;
    var resJSON = {};
		//var self = this;
		async.each(dataArray, function(row, callback){
			mdlUsersFP.getOne(row, function(result) {
				if (result.length > 0) {
          if (result[0].CreateDate < row.CreateDate || result[0].UpdateDate < row.UpdateDate) {
  					mdlUsersFP.update(row, function(result) {
  						resJSON[row[0].CNIC] = result.affectedRows;
  						callback();
  					});
          }
				} else {
					mdlUsersFP.create(row, function(result) {
						resJSON[row[0].CNIC] = result.affectedRows;
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

module.exports = mdlUsersFP;
