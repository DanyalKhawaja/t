var db = require('../config/connection');
var async = require('async');

var mdlMonitoring = {

    getAll: function (req, res) {
        var lastSyncDate = "1970-05-01";
        if (req.headers.lastsyncdate) {
            lastSyncDate = new Date(req.headers.lastsyncdate);
        }
        db.query('SELECT * FROM Monitoring WHERE CreateDate > ? ORDER BY CreateDate DESC', lastSyncDate, function (err, result) {
            if (err) {
                console.log(err.message);
            }
            res(err, result);
        });
    },
    getAllByCNIC: function (req, res) {
        
        db.query('SELECT * FROM Monitoring WHERE CNIC = ? ORDER BY CreateDate DESC', [req.CNIC], function (err, result) {
            if (err) {
                console.log(err.message);
            }
            res(err, result);
        });
    },

    getAllUCs: function (req, res) {
        db.query('SELECT Monitoring.*, LLevelStatus.Desc FROM Monitoring \
              LEFT JOIN LLevelStatus on Monitoring.LevelStatus = LLevelStatus.ID \
              ', [req.UCID], function (err, result) {
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
        let MonitoringID = req.MonitoringID;
        db.query("SELECT * FROM Monitoring WHERE CNIC = ? AND MonitoringLevel = ? AND LevelStatus = ?", 
            [req.CNIC, req.MonitoringLevel, req.LevelStatus], function (err, result) {
            if (err) {
                console.log(err.message);
            }
            res(err, result);
        });
    },

    create: function (req, res) {
        var NewMonitoring = req;
        NewMonitoring.Sync = 1;
        
        db.query('INSERT INTO Monitoring SET ?', NewMonitoring, function (err, result) {
            res(err, result);
        });
    },

    update: function (req, res) {
        req.Sync = 1;
        db.query('UPDATE Monitoring SET ? WHERE CNIC = ? AND MonitoringLevel = ? AND VisitNo = ?', 
        [req, req.CNIC, req.MonitoringLevel, req.VisitNo], function (err, result) {
            res(err, result);
        });
    },

    delete: function (req, res) {
        db.query('DELETE FROM Monitoring WHERE MonitoringID = ?', req.MonitoringID, function (err, result) {
            res(err, result);
        });
    },

    wsPost: function (req, res) {
        //var dataArray = JSON.parse(req.body.data);
        var dataArray = req.body;
        var resJSON = [];
        var errorCNIC = [];

        async.each(dataArray['Monitoring'], function (row, callback) {
            mdlMonitoring.getOne(row, function (err, result) {
                //if createdate is not empty only then proceed with creating or updating the record
                if (row.CreateDate) {
                    row.CreateDate = new Date(row.CreateDate);
                    
                    //check if record is found
                    if (result.length > 0) {
                        //compare create date and update date with the ones in the web database
                        // if (result[0].CreateDate < row.CreateDate ) {
                        //     //update record if create date or update date of the new record is greater than the web DB version of the record
                        //     mdlMonitoring.update(row, function (err, result) {
                        //         var returnJSONString = {};
                        //         returnJSONString.MonitoringID = row.MonitoringID;
                        //         returnJSONString.CNIC = row.CNIC;
                        //         //set Sync to 1 if record successfully updated else 0
                        //         returnJSONString.Sync = result != null ? result.affectedRows : 0;
                        //         if (err) {
                        //             returnJSONString.Message = err.message;
                        //             errorCNIC.push(returnJSONString);
                        //         } else {
                        //             returnJSONString.Message = "Record updated successfully!";
                        //         }
                        //         resJSON.push(returnJSONString);
                        //         callback();
                        //     });
                        //     //if the create or update date is not greater than the web DB version of the record,
                        //     //return without any change to the DB
                        // } else {
                            var returnJSONString = {};
                            returnJSONString.MonitoringID = row.MonitoringID;
                            returnJSONString.CNIC = row.CNIC;
                            returnJSONString.Sync = 0;
                            returnJSONString.Message = "Record not updated! Reason: The record on the WEB DB is the same as received  ";
                            resJSON.push(returnJSONString);
                            errorCNIC.push(returnJSONString);
                            callback();
                        // }
                    //if the record is not found in the web DB, insert a new record
                    } else {
                        mdlMonitoring.create(row, function (err, result) {
                            var returnJSONString = {};
                            returnJSONString.MonitoringID = row.MonitoringID;
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
                    returnJSONString.MonitoringID = row.MonitoringID;
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
                    console.log(resJSON.length);
                    console.log(errorCNIC);
                    let json = "{\"Monitoring\": " + JSON.stringify(resJSON) + "}";
                    res.send(json);
                }
            });
    }
};

module.exports = mdlMonitoring;
