var db = require('../config/connection');
var async = require('async');
var ByteBuffer = require('byte-buffer');
var http = require('http');
var fs = require( "fs" );
var Readable = require('stream').Readable;
var util = require('util');





var mdlFingerImages = {

  getAll: function(req, res) {
    let StartDate = "2018-10-20";
    let EndDate = "2018-10-20";
    let CNIC = "";
    if (req.headers.startdate){
      StartDate = new Date(req.headers.startdate);
    }
    if (req.headers.enddate){
      EndDate = new Date(req.headers.enddate);
    }
    console.log(req.headers.cnic);
    if (req.headers.cnic){  
      CNIC = req.headers.cnic;
    }
      var resJSON = [];
      const inStream = new Readable({
        read() {}
      });
			db.query('SELECT * FROM FingerImages WHERE CNIC =  ?', [CNIC], function(err, result) {
        if (err){
          console.log(err.message);
          res.send(err.message);
        }
        async.each(result, function(row, callback){
          if (row.LeftHFinger){
            row.LeftHFinger = row.LeftHFinger.toString('base64');
          }
          if (row.RightHFinger){
            row.RightHFinger = row.RightHFinger.toString('base64');
          }
          //resJSON.push(row);
          resJSON.push(row);
          callback();
        } , function (){
        let json = "{\"FingerImages\": " + JSON.stringify(resJSON) + "}";
        res.send(json);

        // var data=resJSON;//
        // //let us divide this large array into chunks of smaller array
        // function chunk(arr, chunkSize) {
        //     var R = [];
        //     for (var i = 0; i < arr.length; i += chunkSize)
        //         R.push(arr.slice(i, i + chunkSize));
        //     console.log(R.length);
        //     return R;
        // }
        // var new_data=chunk(data,1);//[/* array of arrays*/], chunk size is 10
        // res.writeHead(200, {
        //         'Content-Type': 'application/json',
        //         'Transfer-Encoding': 'chunked'
        // })
        // //res.write("["); //array starting bracket
        // for (var i = 0; i < new_data.length - 1; i++) {
        //         res.write(JSON.stringify(new_data[i]) + ',');
        // }
        
        // res.write(JSON.stringify(new_data[new_data.length-i]));
        // //res.write("]"); //array ending bracket
        // res.end();

        // var ReadStream = function() {
        //   Readable.call(this, {
        //       objectMode: true
        //   });
        
        //   this.data = resJSON;
        //   this.curIndex = 0;
        // };

        // util.inherits(ReadStream, Readable);

        // ReadStream.prototype._read = function() {
        //   if (this.curIndex === this.data.length) {
        //       return this.push(null);
        //   }

        //   var data = this.data[this.curIndex++];
        //   //console.log('read             : ' + JSON.stringify(data));
        //   this.push(JSON.stringify(data));
        // };
        // var rs = new ReadStream();
        // rs.pipe(res);
        //res.send(json);
        
        // res.writeHead(200, {
        //   'Content-Type': 'text/plain',
        //   'Content-Disposition': json
        // });
        // var c = 0;
        // var interval = setInterval(function() {
        //   res.write(JSON.stringify({ foo: Math.random() * 100, count: ++c }) + '\n');
        //   if (c === 10) {
        //     clearInterval(interval);
        //     res.end();
        //   }
        // }, 1000);
        //   var transformStream = JSONStream.stringify();
        //   var outputStream = fileSystem.createWriteStream( __dirname + "/data.json" );
        //   transformStream.pipe( outputStream );
        //   resJSON.forEach( transformStream.write );
        //   transformStream.end();
        //   outputStream.on(
        //     "finish",
        //     function handleFinish() {
        
        //         console.log( chalk.green( "JSONStream serialization complete!" ) );
        //         console.log( "- - - - - - - - - - - - - - - - - - - - - - -" );
        
        //     }
        // );
        
          // var req = http.request(options, function(res) {
          //   res.on( 'data', function(resJSON) { response.write(resJSON); } );
          //   res.on( 'end', function() { response.end(); } );
          // });
          // req.on('error', function(error) { res.send(error.message); });
          // req.end();
    	  });
			});
  },

  getOne: function(req, res) {
    db.query('SELECT * FROM FingerImages WHERE CNIC = ?', req.CNIC, function(err, result) {
      res(err,result);
    });
  },

  create: function(req, res) {
    req.Sync = 1;
    db.query('INSERT INTO FingerImages SET ?', req, function(err, result) {
      res(err, result);
    });
  },

  update: function(req, res) {
    req.Sync = 1;
    db.query('UPDATE FingerImages SET ? WHERE CNIC=?', [req, req.CNIC], function(err, result) {
      res(err, result);
    });

  },

  delete: function(req, res) {
    db.query('DELETE FROM FingerImages WHERE CNIC = ?', req.CNIC, function(err, result) {
      res(err, result);
    });
  },

  wsPost: function(req, res) {
    // var dataArray = JSON.parse(req.body.data);
    var dataArray = req.body;
    var resJSON = [];
    var errorCNIC = [];
    console.log(dataArray['FingerImages'].length);
		async.eachSeries(dataArray['FingerImages'], function(row, callback){
			mdlFingerImages.getOne(row, function(err,result) {
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
    					mdlFingerImages.update(row, function(err, result) {
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
            //if the create or update date is not greater than the web DB version of the record,
            //return without any change to the DB
            } else {
              var returnJSONString = {};
              returnJSONString.CNIC = row.CNIC;
              returnJSONString.Sync = result != null ? result.affectedRows : 0;
              returnJSONString.Message = "Record not updated! Reason: The record on the WEB DB is newer than the one received. ";
              resJSON.push(returnJSONString);
              errorCNIC.push(returnJSONString);
              callback();
            }
          //if the record is not found in the web DB, insert a new record
  				} else {
  					mdlFingerImages.create(row, function(err, result) {
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
        let json = "{\"FingerImages\": " + JSON.stringify(resJSON) + "}";
    		res.send(json);
			}
		});
  }
};

module.exports = mdlFingerImages;
