var db = require('../config/connection');
var async = require('async');

var mdlVillages = {

  getAll: function(req, res) {
    var lastSyncDate = "1970-01-01";
    if (req.headers.lastsyncdate){
      lastSyncDate = new Date(req.headers.lastsyncdate);
    }
			db.query('SELECT * FROM Villages WHERE CreateDate > ? OR UpdateDate > ? ORDER BY VillageName ASC', [lastSyncDate, lastSyncDate], function(err, result) {
        if (err){
          console.log(err.message);
        }
				res(err,result);
			});
  },

  getOne: function(req, res) {
    var VillageID = req.VillageID;
    db.query('SELECT * FROM Villages WHERE VillageID = ?', VillageID, function(err, result) {
      res(err,result);
    });
  },

  create: function(req, res) {
    req.Sync = 1;
    db.query('INSERT INTO Villages SET ?', req, function(err, result) {
      res(err, result);
    });
  },

  update: function(req, res) {
    req.Sync = 1;

    db.query('UPDATE Villages SET ? WHERE VillageID=?', [req, req.VillageID], function(err, result) {
      res(result);
    });

  },

  delete: function(req, res) {
    let VillageID = req.VillageID;
    db.query('DELETE FROM Villages WHERE VillageID = ?', VillageID, function(err, result) {
      res(err, result);
    });
  },

  wsPost: function(req, res) {
    //var dataArray = JSON.parse(req.body.data);
    var dataArray = req.body;
    var resJSON = [];
    var errorCNIC = [];
    //console.log(dataArray['Villages'].length);
    //console.log(dataArray['Villages']);
    async.each(dataArray['Villages'], function(row, callback){
      mdlVillages.getOne(row, function(err,result) {
        //if createdate is not empty only then proceed with creating or updating the record
        if (row.CreateDate) {
          row.CreateDate = new Date(row.CreateDate);
          //if update date is empty set it as the current datetime
          if (row.UpdateDate) {
            row.UpdateDate = new Date(row.UpdateDate);
          } else {
            row.UpdateDate = new Date();
          }
          //check if record is found
          if (result) {
          if (result.length > 0) {
            //compare create date and update date with the ones in the web database
            if ((result[0].CreateDate < row.CreateDate) || (result[0].UpdateDate < row.UpdateDate)) {
              //update record if create date or update date of the new record is greater than the web DB version of the record
              mdlVillages.update(row, function(err, result) {
                var returnJSONString = {};
                returnJSONString.VillageID = row.VillageID;
                //set Sync to 1 if record successfully updated else 0
                returnJSONString.Sync = result != null ? result.affectedRows : 0;
                if (err) {
                  returnJSONString.Message = err.message;
                  errorCNIC.push(returnJSONString);
                } else {
                  returnJSONString.Message = "Record updated successfully!";
                }
                resJSON.push(returnJSONString);
                callback();
              });
            //if the create or update date is not greater than the web DB version of the record,
            //return without any change to the DB
            } else {
              var returnJSONString = {};
              returnJSONString.VillageID = row.VillageID;
              returnJSONString.Sync = 0;
              returnJSONString.Message = "Record not updated! Reason: The record on the WEB DB is newer than the one received. ";
              errorCNIC.push(returnJSONString);
              resJSON.push(returnJSONString);
              callback();
            }
          //if the record is not found in the web DB, insert a new record
          } else {
            mdlVillages.create(row, function(err, result) {
              var returnJSONString = {};
              returnJSONString.VillageID = row.VillageID;
              returnJSONString.Sync = result != null ? result.affectedRows : 0;
              if (err) {
                returnJSONString.Message = "Record not inserted! " + err.message;
                errorCNIC.push(returnJSONString);
              } else {
                returnJSONString.Message = "Record inserted to WEB DB successfully! ";
              }
              resJSON.push(returnJSONString);
              callback();
            });
          }
        } else {
            var returnJSONString = {};
            returnJSONString.VillageID = null;
            returnJSONString.Sync = 0;
            returnJSONString.Message = "Record not updated! Reason: The Village ID is null ";
            errorCNIC.push(returnJSONString);
            resJSON.push(returnJSONString);
            callback();
          }
        //if create date is empty from android, return without any change to the db
        } else {
          var returnJSONString = {};
          returnJSONString.HID = row.HID;
          returnJSONString.Sync = 0;
          returnJSONString.Message = "Record not created or updated! Reason: CreateDate is empty.";
          errorCNIC.push(returnJSONString);
          resJSON.push(returnJSONString);
          callback();
        }

      });
    },
    function (err){
      if (err){
        res.send(err.message);
      } else {
        console.log(resJSON.length);
        let json = "{\"Villages\": " + JSON.stringify(resJSON) + "}";
        //console.log(json);
        res.send(json);
      }
    });
  }
};

module.exports = mdlVillages;
