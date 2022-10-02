var express = require('express');
var router = express.Router();
var db = require('../config/connection');
//var async = require('async');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

router.get('/', isAuthenticated, function(req, res) {
	if (req.user.UserTypeID == 1) {
		res.render('pages/lookups', {
			message: req.flash('message'),
			Permission: 1,
			User: req.user,
			lang: req.session.lang
		});
	} else {
		res.render('pages/page_not_found', {
			message: req.flash('not authorized!'),
			UserRoles: req.user.UserTypeID
		});
	}

});

/* GET lookup values for a particular table. */
router.get('/get', isAuthenticated, function(req, res) {
  var table = req.query.Type;
  db.query('SELECT * FROM ' + table, null, function(err, result) {
    res.send(result);
  });
});

router.post('/post', isAuthenticated, function(req, res, next) {
  var table = req.query.Type;
  var prefix = req.query.Prefix;
	if (prefix == "VisitTypes" ) {
		prefix = "VisitType";
	}
	if (prefix == "UserTypes") {
		prefix = "UserType";
	}
	if (prefix == "HouseTypes"){
		prefix = "HouseType";
	}
  var desc = prefix + "Desc";
	db.query("insert into " + table +" (" + desc + ") \
		values (?)", [req.body.Desc], function(err, result) {

			if (err) {
				console.log(err.message);
			} else {
				res.send(result);
			}
		});

});

router.put('/put', isAuthenticated, function(req, res, next) {

  var table = req.query.Type;
  var prefix = req.query.Prefix;

	if (prefix == "VisitTypes" ) {
		prefix = "VisitType";
	}
	if (prefix == "UserTypes") {
		prefix = "UserType";
	}
	if (prefix == "HouseTypes"){
		prefix = "HouseType";
	}
	var desc = prefix + "Desc";
  var id = prefix + "ID";
	db.query('update ' + table + ' set ' + desc + ' = ? \
		where ' + id + ' = ?', [req.body.Desc, req.body.ID], function(err, result) {
			if (err){
				console.log(err.message);
				res.send();
			}
      console.log(result);
			res.send(result);
		});

});

router.delete('/delete', isAuthenticated, function(req, res, next) {
	var table = req.query.Type;
  var prefix = req.query.Prefix;

	if (prefix == "VisitTypes" ) {
		prefix = "VisitType";
	}
	if (prefix == "UserTypes") {
		prefix = "UserType";
	}
	if (prefix == "HouseTypes"){
		prefix = "HouseType";
	}
	var desc = prefix + "Desc";
  var id = prefix + "ID";
	console.log(req.body);
	db.query('DELETE FROM '+table+' WHERE '+id+'=?', req.body.ID, function(err, result) {
		console.log(result);
		res.send(result);
	});

});



module.exports = router;
