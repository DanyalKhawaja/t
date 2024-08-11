var express = require('express');
var router = express.Router();
var db = require('../config/connection');
var async = require('async');
const {v4: uuidv1} = require('uuid');

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
	async.series({
		UserTypes: function (callback) {
			db.query('select * from LUserTypes', callback)
		},

	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.render('pages/page_not_found', {error_flag: true, save_error: err.message});
		} else {
			//if (req.user.UserTypeID == 1) {
			if (req.user.UserTypeID == 1) {
				res.render('pages/users', {
					message: req.flash('message'),
					UserTypes: results.UserTypes[0],
					Permission: 1,
					lang: req.session.lang,
					User: req.user
				});
			} else {
				res.render('pages/page_not_found', {
					message: req.flash('message')
				});
			}
		}
	});

});

/* GET all users */
router.get('/get', isAuthenticated, function(req, res) {

  db.query('SELECT * FROM Users', null, function(err, result) {
		if (err){
			console.log(err);
		}
    res.json(result);
  });
});

router.get('/getUserByID', isAuthenticated, function(req, res) {
  db.query('SELECT * FROM Users where UserID = ?', [req.query.UserID], function(err, result) {
    res.json(result[0]);
  });
});

router.post('/post', isAuthenticated, function(req, res, next) {
	console.log(req.body);
	req.body.UserID = uuidv1();
	req.body.Sync = 1;
	req.body.CreateDate = new Date();
	req.body.CreatedBy = req.user.UserID;
	db.query("insert into Users set ?", [req.body], function(err, result) {
			if (err) {
				console.log(err.message);
				res.status(400).send({message:err.message});
			} else {
				res.send(result);
			}
		});

});

router.put('/put', isAuthenticated, function(req, res, next) {
	db.query('UPDATE Users SET UserName = ?, UserPassword=?, FirstName = ?, \
		LastName=?, Email=?, Phone=?, UserTypeID=?, UpdateDate=?, UpdatedBy=? WHERE UserID=?',
		[req.body.UserName, req.body.UserPassword, req.body.FirstName, req.body.LastName,
			req.body.Email, req.body.Phone, req.body.UserTypeID, new Date(), req.user.UserID, req.body.UserID], function(err, result) {
		if (err) {
			console.log(err.message);

		} else {
			res.send(result);
		}
	});
});

router.delete('/delete', isAuthenticated, function(req, res, next) {
	db.query('delete from Users where UserID=?', req.query.UserID, function(err, result) {
		console.log(result);
		res.send(result);
	});

});

module.exports = router;
