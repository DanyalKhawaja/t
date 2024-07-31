var express = require('express');
var router = express.Router();
var db = require('../config/connection');
var async = require('async');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

router.get('/', isAuthenticated, function (req, res) {
	async.parallel({
		CountByUCMonth: function (callback) {
			db.query('select  YEAR(CreateDate) yr,MONTHNAME(CreateDate) MON, uc.UCName ucn ,count(*) count from  Monitoring m left join LUCs uc on m.UCID = uc.UCID group by yr, MON, ucn order by yr, mon', null, callback)
		},
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
		} else {
			//if (req.user.UserTypeID == 1) {
			if (req.user.UserTypeID != 4 && req.user.UserTypeID != 6 && req.user.UserTypeID != 7) {
				res.render('pages/survey_stats', {
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user,
					CountByUCMonth: results.CountByUCMonth[0]
				});
			} else {
				res.render('pages/page_not_found', {
					message: req.flash('not authorized!'),
					UserRoles: req.user.UserTypeID,
					lang: req.session.lang
				});
			}
		}
	});

});

module.exports = router;
