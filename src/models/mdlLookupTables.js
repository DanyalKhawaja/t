var db = require('../config/connection');
var async = require('async');
var fs = require('fs');
var path = require('path');

var lookups = {

  getAll: function(req, res) {
    
    var array = fs.readFileSync(path.resolve(__dirname,'../config/lookupTables.txt')).toString().split("\n");
    array.splice(-1,1);
  	var json = {};

  	async.each(array, function(item,callback){
      //console.log(item);
			db.query('SELECT * FROM ' + item, null, function(err, result) {
				json[item.replace(/(\r\n|\n|\r)/gm,"")] = result;
        callback();
			});
    }, function (err){
      json = {"lookups": json};
      //console.log(json);
      res(err, json);
    });

  }
};

module.exports = lookups;
