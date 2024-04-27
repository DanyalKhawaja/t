var db = require('../config/connection');
var async = require('async');

var mdlBeneficiary = {

  getAll: function (req, res) {
    var lastSyncDate = "1970-05-01";
    if (req.headers.lastsyncdate) {
      lastSyncDate = new Date(req.headers.lastsyncdate);
    }
    db.query('SELECT * FROM Beneficiary WHERE CreateDate > ? OR UpdateDate > ?', [lastSyncDate, lastSyncDate], function (err, result) {
      if (err) {
        console.log(err.message);
      }
      res(err, result);
    });
  },

  getBenID: function (req, res) {

    db.query('SELECT CNIC, BeneficiaryID FROM Beneficiary ', null, function (err, result) {
      if (err) {
        console.log(err.message);
      }
      res(err, result);
    });
  },

  getAllUCs: function (req, res) {

    db.query('SELECT \
    Beneficiary.CNIC, Beneficiary.FirstName, Beneficiary.LastName, Beneficiary.PhonePrimary, Beneficiary.PhoneSecondary,\
      Beneficiary.VHLatitude, Beneficiary.VHLongitude, Beneficiary.BenStatusID, \
      m3.MonitoringLevel, m3.LevelStatus, InstallmentType \
    FROM \
	Beneficiary \
	LEFT JOIN( \
        SELECT \
			m1.* \
        FROM \
			Monitoring m1 \
			JOIN( \
          SELECT \
					CNIC,\
          MAX(CreateDate) AS CreateDate \
				FROM \
					Monitoring \
				GROUP BY \
					CNIC \
        ) m2 ON m1.CNIC = m2.CNIC \
			AND m1.CreateDate = m2.CreateDate \
      ) m3 ON Beneficiary.CNIC = m3.CNIC \
	LEFT JOIN( \
        SELECT \
			CNIC, \
        MAX(InstallmentType) AS InstallmentType \
		FROM \
			DistributedCheques \
		GROUP BY \
			CNIC \
      ) DistributedCheques ON Beneficiary.CNIC = DistributedCheques.CNIC \
WHERE \
	BenStatusID = 4 \
GROUP BY \
	Beneficiary.CNIC, Beneficiary.FirstName, Beneficiary.LastName, Beneficiary.PhonePrimary, Beneficiary.PhoneSecondary,\
  Beneficiary.VHLatitude, Beneficiary.VHLongitude, Beneficiary.BenStatusID, \
  m3.MonitoringLevel, m3.LevelStatus, InstallmentType', [req.UCID], function (err, result) {
      if (err) {
        console.log(err.message);
      }
      res(err, result);
    });
  },

  getTotalCount: function (req, res) {
    db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary', null, function (err, result) {
      if (err) {
        console.log(err.message);
      }
      res(err, result);
    });
  },

  getOne: function (req, res) {
    let CNIC = req.CNIC;
    db.query("SELECT *, REPLACE(REPLACE(REPLACE(Comments, '\n', ''), '\r', ''), '\"','') as Comments FROM Beneficiary WHERE CNIC = ?", CNIC, function (err, result) {
      if (err) {
        console.log(err.message);
      }
      res(err, result);
    });
  },

  create: function (req, res) {
    var NewBeneficiary = req;
    NewBeneficiary.Sync = 1;
    console.log(NewBeneficiary.CNIC);
    db.query('INSERT INTO Beneficiary SET ?', NewBeneficiary, function (err, result) {
      res(err, result);
    });
  },

  update: function (req, res) {
    req.Sync = 1;
    db.query('UPDATE Beneficiary SET ? WHERE CNIC=?', [req, req.CNIC], function (err, result) {
      res(err, result);
    });
  },

  delete: function (req, res) {
    var CNIC = req.CNIC || req[0].CNIC;
    db.query('DELETE FROM Beneficiary WHERE CNIC = ?', CNIC, function (err, result) {
      res(err, result);
    });
  },

  wsPost: function (req, res) {
    console.log("hello1");

    var dataArray = [];
    var resJSON = [];
    var errorCNIC = [];
    var updatedCount = 0;
    var createdCount = 0;
    var rejectedCount = 0;
    try {
      dataArray = req.body;
      //dataArray = JSON.parse(req.body);
    } catch (err) {
      console.log("Error: " + err.message);
    }
    console.log(dataArray['Beneficiary'].length);
    async.eachSeries(dataArray['Beneficiary'], function (row, callback) {
      mdlBeneficiary.getOne(row, function (err, result) {
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
            //console.log(result[0].BenStatusID);
            if (result[0].BenStatusID != 3 && result[0].BenStatusID != 4 && result[0].BenStatusID != 5 && result[0].BenStatusID != 7) {
              //update record if create date or update date of the new record is greater than the web DB version of the record
              row.UpdateDate = new Date();
              if (result[0].IsNew === 1) {
                row.IsNew = '1';
              }
              mdlBeneficiary.update(row, function (err, result) {
                var returnJSONString = {};
                returnJSONString.CNIC = row.CNIC;
                //set Sync to 1 if record successfully updated else 0
                returnJSONString.Sync = result != null ? result.affectedRows : 0;
                if (err) {
                  returnJSONString.Message = err.message;
                  errorCNIC.push(returnJSONString);
                } else {
                  returnJSONString.Message = "Record updated successfully!";
                  updatedCount++;
                }
                resJSON.push(returnJSONString);
                callback();
              });
              //if the create or update date is not greater than the web DB version of the record,
              //return without any change to the DB
            } else {
              var returnJSONString = {};
              returnJSONString.CNIC = row.CNIC;
              returnJSONString.Sync = 0;
              returnJSONString.Message = "Record not updated! Reason: The record on the WEB DB is newer than the one received or is the same ";
              resJSON.push(returnJSONString);
              errorCNIC.push(returnJSONString);
              rejectedCount++;
              callback();
            }
            //if the record is not found in the web DB, insert a new record
          }
          else {
            // mdlBeneficiary.create(row, function (err, result) {
            //   var returnJSONString = {};
            //   returnJSONString.CNIC = row.CNIC;
            //   returnJSONString.Sync = result != null ? result.affectedRows : 0;
            //   if (err) {
            //     returnJSONString.Message = "Record not inserted! " + err.message;
            //     errorCNIC.push(returnJSONString);
            //   } else {
            //     returnJSONString.Message = "Record inserted to WEB DB successfully! ";
            //     createdCount++;
            //   }
            //   resJSON.push(returnJSONString);
            //   callback();
            // });
            var returnJSONString = {};
            returnJSONString.CNIC = row.CNIC;
            returnJSONString.Message = "No update required! ";
            resJSON.push(returnJSONString);
            callback();
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
      function (err) {
        if (err) {
          res.send(err.message);
        } else {
          console.log(errorCNIC);
          console.log("Records checked: " + resJSON.length);
          console.log("Records Updated: " + updatedCount);
          console.log("Records Created: " + createdCount);
          console.log("Records Rejected: " + rejectedCount);
          let json = "{\"Beneficiary\": " + JSON.stringify(resJSON) + "}";
          res.send(json);
        }
      });
  }
};

module.exports = mdlBeneficiary;
