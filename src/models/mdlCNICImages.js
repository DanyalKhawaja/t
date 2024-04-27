var db = require('../config/connection');
var async = require('async');
var ByteBuffer = require('byte-buffer');
var Jimp = require('jimp');

var mdlCNICImages = {

  getAll: function(req, res) {
    var lastSyncDate = "1970-01-01";
    if (req.headers.lastsyncdate){
      lastSyncDate = new Date(req.headers.lastsyncdate);
    }
      var resJSON = [];
			db.query('SELECT * FROM CNICImages WHERE CreateDate > ? OR UpdateDate > ?', [lastSyncDate, lastSyncDate], function(err, result) {
        if (err){
          console.log(err.message);
          res.send(err.message);
        }
        async.each(result, function(row, callback){
          if (row.CNICFront){
            row.CNICFront = row.CNICFront.toString();
          }
          if (row.CNICBack){
            row.CNICBack = row.CNICBack.toString();
          }
          resJSON.push(row);
          callback();
        } , function (){
          let json = "{\"CNICImages\": " + JSON.stringify(resJSON) + "}";
          res.send(json);
    		});
			});
  },

  getOne: function(req, res) {
    db.query('SELECT * FROM CNICImages WHERE CNIC = ?', req.CNIC, function(err, result) {
      res(err, result);
    });
  },

  create: function(req, res) {
    req.Sync = 1;
    var CNICImages = req;
    // db.query('INSERT INTO CNICImages SET ?', CNICImages, function(err, result) {
      
    //   res(err, result);
    // });

    Jimp.read(Buffer.from(CNICImages.CNICFront,"base64"))
      .then(CNICFront => {
        //CNICFront.resize(500, Jimp.AUTO);
        CNICFront.getBuffer(Jimp.MIME_JPEG, function(err, result){
          CNICImages.CNICFront = result;
          Jimp.read(Buffer.from(CNICImages.CNICBack,"base64"))
            .then(CNICBack => {
              //CNICBack.resize(500, Jimp.AUTO);
              CNICBack.getBuffer(Jimp.MIME_JPEG, function(err, result){
                CNICImages.CNICBack = result;
                db.query('INSERT INTO CNICImages SET ?', CNICImages, function(err, result) {
                  res(err, result);
                });
              });
            })
            .catch(err => {
              res(err, null);
            });
        });
      })
      .catch(err => {
        res(err, null);
      });
  },

  update: function(req, res) {
    req.Sync = 1;
    var CNICImages = req;
    Jimp.read(Buffer.from(CNICImages.CNICFront,"base64"))
      .then(CNICFront => {
        //CNICFront.resize(500, Jimp.AUTO);
        CNICFront.getBuffer(Jimp.MIME_JPEG, function(err, result){
          CNICImages.CNICFront = result;
          Jimp.read(Buffer.from(CNICImages.CNICBack,"base64"))
            .then(CNICBack => {
              //CNICBack.resize(500, Jimp.AUTO);
              CNICBack.getBuffer(Jimp.MIME_JPEG, function(err, result){
                CNICImages.CNICBack = result;
                db.query('UPDATE CNICImages SET ? WHERE CNIC=?', [CNICImages, CNICImages.CNIC], function(err, result) {
                  res(err, result);
                });
              });
            })
            .catch(err => {
              res(err, null);
            });
        });
      })
      .catch(err => {
        res(err, null);
      });
  },

  delete: function(req, res) {
    db.query('DELETE FROM CNICImages WHERE CNIC = ?', req.CNIC, function(err, result) {
      res(err, result);
    });
  },

  wsPost: function(req, res) {
    //var dataArray = JSON.parse(req.body.data);
    var dataArray = req.body;
    var resJSON = [];
    var errorCNIC = [];
    console.log(dataArray['CNICImages'].length);
		async.eachSeries(dataArray['CNICImages'], function(row, callback){
			mdlCNICImages.getOne(row, function(err,result) {
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
  				if (result.length > 0) {
            //compare create date and update date with the ones in the web database
            if ((result[0].CreateDate < row.CreateDate) || (result[0].UpdateDate < row.UpdateDate)) {
              //update record if create date or update date of the new record is greater than the web DB version of the record
              console.log('Updating CNIC Images for CNIC:'+row.CNIC);
    					mdlCNICImages.update(row, function(err, result) {
                var returnJSONString = {};
                returnJSONString.CNIC = row.CNIC;
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
            // if the create or update date is not greater than the web DB version of the record,
            // return without any change to the DB
            } else {
              var returnJSONString = {};
              returnJSONString.CNIC = row.CNIC;
              returnJSONString.Sync = 0;
              returnJSONString.Message = "Record not updated! Reason: The record on the WEB DB is newer than the one received. ";
              resJSON.push(returnJSONString);
              errorCNIC.push(returnJSONString);
              callback();
            }
          //if the record is not found in the web DB, insert a new record
  				} else {
            console.log('Inserting CNIC Images for CNIC:'+row.CNIC);
  					mdlCNICImages.create(row, function(err, result) {
              var returnJSONString = {};
              returnJSONString.CNIC = row.CNIC;
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
        //if create date is empty from android, return without any change to the db
        } else {
          var returnJSONString = {};
          returnJSONString.CNIC = row.CNIC;
          returnJSONString.Sync = 0;
          returnJSONString.Message = "Record not created or updated! Reason: CreateDate is empty.";
          resJSON.push(returnJSONString);
          errorCNIC.push(returnJSONString);
          callback();
        }

			});
		},
		function (err){
			if (err){
				res.send(err.message);
			} else {
        console.log(resJSON.length);
        console.log(errorCNIC);
        let json = "{\"CNICImages\": " + JSON.stringify(resJSON) + "}";
        //console.log(json);
    		res.send(json);
			}
		});
  }
};

module.exports = mdlCNICImages;
