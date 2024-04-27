var express = require('express');
var router = express.Router();
var db = require('../config/connection');
//var async = require('async');
const uuidv1 = require('uuid/v1');
var passport = require('passport');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}


/* GET count of ExCombatants for a region */
router.get('/excombatantsByRegion', isAuthenticated, function(req, res) {
  db.query('SELECT count(ExCombatantId) as count from ExCombatant', null, function(result, err) {
		//console.log(result);
		if (err){
			console.log(err.message);
			res.send();
		} else {
			//console.log(result[0]);
			res.send(result[0]);
		}

  });
});



module.exports = router;
