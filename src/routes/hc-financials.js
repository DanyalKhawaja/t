var express = require('express');
var router = express.Router();
var db = require('../config/connection');
var async = require('async');
let mdlBeneficiary = require('../models/mdlBeneficiary');

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
		Districts: function (callback) {
			mdlBeneficiary.getAll(req, callback)
		},
		TotalCounts: function (callback) {
			db.query('SELECT \
				SUM(CASE WHEN InstallmentType = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment1,\
				SUM(CASE WHEN InstallmentType = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment2,\
				SUM(CASE WHEN InstallmentType = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment3,\
				SUM(CASE WHEN InstallmentType = 4 THEN 1 ELSE 0 END) AS TotalCountInstallment4 \
			 FROM DistributedCheques ', null, callback)
		},
		TotalCountInstallment1ByUC: function (callback) {
			db.query('SELECT \
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment1Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment1Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment1Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment1Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment1Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment1Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment1Dandar \
			 	FROM DistributedCheques \
			 	LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			 	WHERE DistributedCheques.InstallmentType = 1', null, callback)
		},
		TotalCountInstallment2ByUC: function (callback) {
			db.query('SELECT \
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment2Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment2Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment2Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment2Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment2Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment2Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment2Dandar \
			 	FROM DistributedCheques \
			 	LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			 	WHERE DistributedCheques.InstallmentType = 2', null, callback)
		},
		
		TotalCountInstallment3ByUC: function (callback) {
			db.query('SELECT \
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment3Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment3Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment3Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment3Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment3Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment3Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment3Dandar \
			 	FROM DistributedCheques \
			 	LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			 	WHERE DistributedCheques.InstallmentType = 4', null, callback)
		},
		TotalCountInstallment4ByUC: function (callback) {
			db.query('SELECT \
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment4Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 4 THEN 1 ELSE 0 END) AS TotalCountInstallment4Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment4Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment4Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment4Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment4Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment4Dandar \
			 	FROM DistributedCheques \
			 	LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			 	WHERE DistributedCheques.InstallmentType = 3', null, callback)
		},
		LastDisbursementOn: function (callback) {
			db.query('SELECT Date_format(max(CreateDate), \'%M %d, %Y\') as LD FROM DistributedCheques ', null, callback)
		},
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
		} else {
			//if (req.user.UserTypeID == 1) {
			if (req.user.UserTypeID != 4 && req.user.UserTypeID != 6 && req.user.UserTypeID != 7) {
				res.render('pages/hc-financials', {
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user,
  				    TotalCounts: results.TotalCounts[0],
					TotalCountInstallment1ByUC: results.TotalCountInstallment1ByUC[0],
					TotalCountInstallment2ByUC: results.TotalCountInstallment2ByUC[0],
					TotalCountInstallment3ByUC: results.TotalCountInstallment3ByUC[0],
					TotalCountInstallment4ByUC: results.TotalCountInstallment4ByUC[0],
					LastDisbursementOn: results.LastDisbursementOn[0].LD
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

router.get('/first_installment', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6 || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		async.parallel({
			TotalCountApproved: function (callback) {
				db.query('SELECT count(CNIC) as TotalCountApproved from Beneficiary\
					WHERE BenStatusID = 4 ', null, callback)
			},
			TotalCounts: function (callback) {
				db.query('SELECT \
						SUM(CASE WHEN InstallmentType = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment1,\
						SUM(CASE WHEN InstallmentType = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment2,\
						SUM(CASE WHEN InstallmentType = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment3,\
						SUM(CASE WHEN InstallmentType = 4 THEN 1 ELSE 0 END) AS TotalCountInstallment4 \
					 FROM DistributedCheques ', null, callback)
			},
			TotalCountInstallment_ByUC: function (callback) {
				db.query('SELECT \
						SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment_Awaran,\
						SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gishkore,\
						SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment_Teertaje,\
						SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gajjar,\
						SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment_Nokjo,\
						SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment_Parwar,\
						SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment_Dandar \
						 FROM DistributedCheques \
						 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
						 WHERE DistributedCheques.InstallmentType = 1', null, callback)
			},
			TotalCountInstallment_ByUCnMonth: function (callback) {
				db.query('SELECT CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) as Month,\
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment_Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment_Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment_Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment_Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment_Dandar \
				 FROM DistributedCheques \
				 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
				 WHERE DistributedCheques.InstallmentType = 1 \
				 GROUP BY Month', null, callback)
			},
			Installment_DisbursementByUCnMonth: function (callback) {
				db.query('SELECT LUCs.UCName, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-03" THEN 1 ELSE 0 END) AS TotalCount0319, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-04" THEN 1 ELSE 0 END) AS TotalCount0419, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-05" THEN 1 ELSE 0 END) AS TotalCount0519, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-06" THEN 1 ELSE 0 END) AS TotalCount0619, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-07" THEN 1 ELSE 0 END) AS TotalCount0719, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-08" THEN 1 ELSE 0 END) AS TotalCount0819, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-09" THEN 1 ELSE 0 END) AS TotalCount0919, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-10" THEN 1 ELSE 0 END) AS TotalCount1019, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-11" THEN 1 ELSE 0 END) AS TotalCount1119, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-12" THEN 1 ELSE 0 END) AS TotalCount1219, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-01" THEN 1 ELSE 0 END) AS TotalCount0120, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-02" THEN 1 ELSE 0 END) AS TotalCount0220, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-03" THEN 1 ELSE 0 END) AS TotalCount0320, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-04" THEN 1 ELSE 0 END) AS TotalCount0420, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-05" THEN 1 ELSE 0 END) AS TotalCount0520, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-06" THEN 1 ELSE 0 END) AS TotalCount0620, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-07" THEN 1 ELSE 0 END) AS TotalCount0720, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-08" THEN 1 ELSE 0 END) AS TotalCount0820 \
							FROM DistributedCheques \
							LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
							LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
							WHERE DistributedCheques.InstallmentType = 1 \
							GROUP BY Beneficiary.UCID', null, callback)
			},
			TotalCountsInstallment_DisbursementByMonth: function (callback) {
				db.query('SELECT \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-03" THEN 1 ELSE 0 END) AS TotalCount0319, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-04" THEN 1 ELSE 0 END) AS TotalCount0419, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-05" THEN 1 ELSE 0 END) AS TotalCount0519, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-06" THEN 1 ELSE 0 END) AS TotalCount0619, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-07" THEN 1 ELSE 0 END) AS TotalCount0719, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-08" THEN 1 ELSE 0 END) AS TotalCount0819, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-09" THEN 1 ELSE 0 END) AS TotalCount0919, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-10" THEN 1 ELSE 0 END) AS TotalCount1019, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-11" THEN 1 ELSE 0 END) AS TotalCount1119, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-12" THEN 1 ELSE 0 END) AS TotalCount1219, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-01" THEN 1 ELSE 0 END) AS TotalCount0120, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-02" THEN 1 ELSE 0 END) AS TotalCount0220, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-03" THEN 1 ELSE 0 END) AS TotalCount0320, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-04" THEN 1 ELSE 0 END) AS TotalCount0420, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-05" THEN 1 ELSE 0 END) AS TotalCount0520, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-06" THEN 1 ELSE 0 END) AS TotalCount0620, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-07" THEN 1 ELSE 0 END) AS TotalCount0720, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-08" THEN 1 ELSE 0 END) AS TotalCount0820 \
				FROM DistributedCheques \
				LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
				LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
				WHERE DistributedCheques.InstallmentType = 1 ', null, callback)
			},
			LastDisbursementOn: function (callback) {
				db.query('SELECT Date_format(max(CreateDate), \'%M %d, %Y\') as LD FROM DistributedCheques where InstallmentType=1', null, callback)
			},

		}, function (err, results) {
			if (err) {
				console.log(err.message);
				res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
			} else {
				//if (req.user.UserTypeID == 1) {
			
	
				
					console.log(results.Installment_DisbursementByUCnMonth);
	

				res.render('pages/installment_details', {
					GraphTitle: '1st Installment Cheque Encashment By Month',
					TableTitle: "Monthly Cheque Encashment as Per Bank Reconciliation",
					PointLabel: "Cheques encashed by # of beneficiaries",
					Installment: "1st",
					InstallmentAmount: "88,000.00",
					TotalCountInstallment_: results.TotalCounts[0].TotalCountInstallment1,
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user,
					TotalCounts: results.TotalCounts[0],
					TotalCount: results.TotalCounts[0].TotalCountInstallment1 + results.TotalCounts[0].TotalCountInstallment2 + results.TotalCounts[0].TotalCountInstallment3 + results.TotalCounts[0].TotalCountInstallment4,
					TotalCountInstallment_ByUC: results.TotalCountInstallment_ByUC[0],
					TotalCountApproved: results.TotalCountApproved[0].TotalCountApproved,
					TotalCountInstallment_ByUCnMonth: results.TotalCountInstallment_ByUCnMonth,
					Installment_DisbursementByUCnMonth: results.Installment_DisbursementByUCnMonth,
					TotalCountsInstallment_DisbursementByMonth: results.TotalCountsInstallment_DisbursementByMonth[0],
					LastDisbursementOn: results.LastDisbursementOn[0].LD
				});
			}
		});

	}
});

router.get('/second_installment', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6 || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		async.parallel({
			TotalCountApproved: function (callback) {
				db.query('SELECT count(CNIC) as TotalCountApproved from Beneficiary\
				WHERE BenStatusID = 4 ', null, callback)
			},
			TotalCounts: function (callback) {
				db.query('SELECT \
					SUM(CASE WHEN InstallmentType = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment1,\
					SUM(CASE WHEN InstallmentType = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment2,\
					SUM(CASE WHEN InstallmentType = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment3,\
					SUM(CASE WHEN InstallmentType = 4 THEN 1 ELSE 0 END) AS TotalCountInstallment4 \
				 FROM DistributedCheques ', null, callback)
			},
			TotalCountInstallment_ByUC: function (callback) {
				db.query('SELECT \
					SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment_Awaran,\
					SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gishkore,\
					SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment_Teertaje,\
					SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gajjar,\
					SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment_Nokjo,\
					SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment_Parwar,\
					SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment_Dandar \
					 FROM DistributedCheques \
					 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
					 WHERE DistributedCheques.InstallmentType = 2', null, callback)
			},
			TotalCountInstallment_ByUCnMonth: function (callback) {
				db.query('SELECT CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) as Month,\
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment_Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment_Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment_Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment_Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment_Dandar \
				 FROM DistributedCheques \
				 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
				 WHERE DistributedCheques.InstallmentType = 2 \
				 GROUP BY Month', null, callback)
			},
			Installment_DisbursementByUCnMonth: function (callback) {
				db.query('SELECT LUCs.UCName, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-03" THEN 1 ELSE 0 END) AS TotalCount0319, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-04" THEN 1 ELSE 0 END) AS TotalCount0419, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-05" THEN 1 ELSE 0 END) AS TotalCount0519, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-06" THEN 1 ELSE 0 END) AS TotalCount0619, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-07" THEN 1 ELSE 0 END) AS TotalCount0719, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-08" THEN 1 ELSE 0 END) AS TotalCount0819, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-09" THEN 1 ELSE 0 END) AS TotalCount0919, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-10" THEN 1 ELSE 0 END) AS TotalCount1019, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-11" THEN 1 ELSE 0 END) AS TotalCount1119, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-12" THEN 1 ELSE 0 END) AS TotalCount1219, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-01" THEN 1 ELSE 0 END) AS TotalCount0120, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-02" THEN 1 ELSE 0 END) AS TotalCount0220, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-03" THEN 1 ELSE 0 END) AS TotalCount0320, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-04" THEN 1 ELSE 0 END) AS TotalCount0420, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-05" THEN 1 ELSE 0 END) AS TotalCount0520, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-06" THEN 1 ELSE 0 END) AS TotalCount0620, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-07" THEN 1 ELSE 0 END) AS TotalCount0720, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-08" THEN 1 ELSE 0 END) AS TotalCount0820 \
							FROM DistributedCheques \
							LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
							LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
							WHERE DistributedCheques.InstallmentType = 2 \
							GROUP BY Beneficiary.UCID', null, callback)
			},
			TotalCountsInstallment_DisbursementByMonth: function (callback) {
				db.query('SELECT \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-03" THEN 1 ELSE 0 END) AS TotalCount0319, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-04" THEN 1 ELSE 0 END) AS TotalCount0419, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-05" THEN 1 ELSE 0 END) AS TotalCount0519, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-06" THEN 1 ELSE 0 END) AS TotalCount0619, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-07" THEN 1 ELSE 0 END) AS TotalCount0719, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-08" THEN 1 ELSE 0 END) AS TotalCount0819, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-09" THEN 1 ELSE 0 END) AS TotalCount0919, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-10" THEN 1 ELSE 0 END) AS TotalCount1019, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-11" THEN 1 ELSE 0 END) AS TotalCount1119, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-12" THEN 1 ELSE 0 END) AS TotalCount1219, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-01" THEN 1 ELSE 0 END) AS TotalCount0120, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-02" THEN 1 ELSE 0 END) AS TotalCount0220, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-03" THEN 1 ELSE 0 END) AS TotalCount0320, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-04" THEN 1 ELSE 0 END) AS TotalCount0420, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-05" THEN 1 ELSE 0 END) AS TotalCount0520, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-06" THEN 1 ELSE 0 END) AS TotalCount0620, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-07" THEN 1 ELSE 0 END) AS TotalCount0720, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-08" THEN 1 ELSE 0 END) AS TotalCount0820 \
				FROM DistributedCheques \
				LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
				LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
				WHERE DistributedCheques.InstallmentType = 2 ', null, callback)
			},
			LastDisbursementOn: function (callback) {
				db.query('SELECT Date_format(max(CreateDate), \'%M %d, %Y\') as LD FROM DistributedCheques where InstallmentType=2', null, callback)
			},

		}, function (err, results) {
			if (err) {
				console.log(err.message);
				res.render('pages/page_not_found', { error_flag: true, save_error: err.message });
			} else {
				//if (req.user.UserTypeID == 1) {
	
				
					console.log(results.Installment_DisbursementByUCnMonth);
			
				res.render('pages/installment_details', {
					GraphTitle: '2nd Installment Disbursement By Month',
					TableTitle: "Monthly Disbursement of 2nd Installment",
					PointLabel: "Cheques disbursed to # of beneficiaries",
					Installment: "2nd",
					InstallmentAmount: "66,000.00",
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user,
					TotalCounts: results.TotalCounts[0],
					TotalCountInstallment_: results.TotalCounts[0].TotalCountInstallment2,
					TotalCount: results.TotalCounts[0].TotalCountInstallment1 + results.TotalCounts[0].TotalCountInstallment_ + results.TotalCounts[0].TotalCountInstallment3 + results.TotalCounts[0].TotalCountInstallment4,
					TotalCountInstallment_ByUC: results.TotalCountInstallment_ByUC[0],
					TotalCountApproved: results.TotalCountApproved[0].TotalCountApproved,
					TotalCountInstallment_ByUCnMonth: results.TotalCountInstallment_ByUCnMonth,
					Installment_DisbursementByUCnMonth: results.Installment_DisbursementByUCnMonth,
					TotalCountsInstallment_DisbursementByMonth: results.TotalCountsInstallment_DisbursementByMonth[0],
					LastDisbursementOn: results.LastDisbursementOn[0].LD
				});
			}
		});

	}
});

router.get('/third_installment', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6 || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		async.parallel({
			TotalCountApproved: function (callback) {
				db.query('SELECT count(CNIC) as TotalCountApproved from Beneficiary\
				WHERE BenStatusID = 4 ', null, callback)
			},
			TotalCounts: function (callback) {
				db.query('SELECT \
					SUM(CASE WHEN InstallmentType = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment1,\
					SUM(CASE WHEN InstallmentType = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment2,\
					SUM(CASE WHEN InstallmentType = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment3,\
					SUM(CASE WHEN InstallmentType = 4 THEN 1 ELSE 0 END) AS TotalCountInstallment4 \
				 FROM DistributedCheques ', null, callback)
			},
			TotalCountInstallment_ByUC: function (callback) {
				db.query('SELECT \
					SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment_Awaran,\
					SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gishkore,\
					SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment_Teertaje,\
					SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gajjar,\
					SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment_Nokjo,\
					SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment_Parwar,\
					SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment_Dandar \
					 FROM DistributedCheques \
					 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
					 WHERE DistributedCheques.InstallmentType = 3', null, callback)
			},
			TotalCountInstallment_ByUCnMonth: function (callback) {
				db.query('SELECT CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) as Month,\
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment_Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment_Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment_Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment_Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment_Dandar \
				 FROM DistributedCheques \
				 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
				 WHERE DistributedCheques.InstallmentType = 3 \
				 GROUP BY Month', null, callback)
			},
			Installment_DisbursementByUCnMonth: function (callback) {
				db.query('SELECT LUCs.UCName, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-03" THEN 1 ELSE 0 END) AS TotalCount0319, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-04" THEN 1 ELSE 0 END) AS TotalCount0419, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-05" THEN 1 ELSE 0 END) AS TotalCount0519, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-06" THEN 1 ELSE 0 END) AS TotalCount0619, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-07" THEN 1 ELSE 0 END) AS TotalCount0719, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-08" THEN 1 ELSE 0 END) AS TotalCount0819, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-09" THEN 1 ELSE 0 END) AS TotalCount0919, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-10" THEN 1 ELSE 0 END) AS TotalCount1019, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-11" THEN 1 ELSE 0 END) AS TotalCount1119, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-12" THEN 1 ELSE 0 END) AS TotalCount1219, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-01" THEN 1 ELSE 0 END) AS TotalCount0120, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-02" THEN 1 ELSE 0 END) AS TotalCount0220, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-03" THEN 1 ELSE 0 END) AS TotalCount0320, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-04" THEN 1 ELSE 0 END) AS TotalCount0420, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-05" THEN 1 ELSE 0 END) AS TotalCount0520, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-06" THEN 1 ELSE 0 END) AS TotalCount0620, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-07" THEN 1 ELSE 0 END) AS TotalCount0720, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-08" THEN 1 ELSE 0 END) AS TotalCount0820 \
					FROM DistributedCheques \
					LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
					LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
					WHERE DistributedCheques.InstallmentType = 3 \
					GROUP BY Beneficiary.UCID', null, callback)
			},
			TotalCountsInstallment_DisbursementByMonth: function (callback) {
				db.query('SELECT \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-03" THEN 1 ELSE 0 END) AS TotalCount0319, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-04" THEN 1 ELSE 0 END) AS TotalCount0419, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-05" THEN 1 ELSE 0 END) AS TotalCount0519, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-06" THEN 1 ELSE 0 END) AS TotalCount0619, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-07" THEN 1 ELSE 0 END) AS TotalCount0719, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-08" THEN 1 ELSE 0 END) AS TotalCount0819, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-09" THEN 1 ELSE 0 END) AS TotalCount0919, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-10" THEN 1 ELSE 0 END) AS TotalCount1019, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-11" THEN 1 ELSE 0 END) AS TotalCount1119, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-12" THEN 1 ELSE 0 END) AS TotalCount1219, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-01" THEN 1 ELSE 0 END) AS TotalCount0120, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-02" THEN 1 ELSE 0 END) AS TotalCount0220, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-03" THEN 1 ELSE 0 END) AS TotalCount0320, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-04" THEN 1 ELSE 0 END) AS TotalCount0420, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-05" THEN 1 ELSE 0 END) AS TotalCount0520, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-06" THEN 1 ELSE 0 END) AS TotalCount0620, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-07" THEN 1 ELSE 0 END) AS TotalCount0720, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-08" THEN 1 ELSE 0 END) AS TotalCount0820 \
				FROM DistributedCheques \
				LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
				LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
				WHERE DistributedCheques.InstallmentType = 3 ', null, callback)
			},
			LastDisbursementOn: function (callback) {
				db.query('SELECT Date_format(max(CreateDate), \'%M %d, %Y\') as LD FROM DistributedCheques where InstallmentType=3', null, callback)
			},

		}, function (err, results) {
			if (err) {
				console.log(err.message);
				res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
			} else {
				//if (req.user.UserTypeID == 1) {
				res.render('pages/installment_details', {
					GraphTitle: '3rd Installment Disbursement By Month',
					TableTitle: "Monthly Disbursement of 3rd Installment",
					PointLabel: "Cheques disbursed to # of beneficiaries",
					Installment: "3rd",
					InstallmentAmount: "56,000.00",
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					TotalCountInstallment_: results.TotalCounts[0].TotalCountInstallment3,
					User: req.user,
					TotalCounts: results.TotalCounts[0],
					TotalCount: results.TotalCounts[0].TotalCountInstallment1 + results.TotalCounts[0].TotalCountInstallment2 + results.TotalCounts[0].TotalCountInstallment3 + results.TotalCounts[0].TotalCountInstallment4,
					TotalCountInstallment_ByUC: results.TotalCountInstallment_ByUC[0],
					TotalCountApproved: results.TotalCountApproved[0].TotalCountApproved,
					TotalCountInstallment_ByUCnMonth: results.TotalCountInstallment_ByUCnMonth,
					Installment_DisbursementByUCnMonth: results.Installment_DisbursementByUCnMonth,
					TotalCountsInstallment_DisbursementByMonth: results.TotalCountsInstallment_DisbursementByMonth[0],
					LastDisbursementOn: results.LastDisbursementOn[0].LD
				});
			}
		});

	}
});

router.get('/fourth_installment', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6 || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		async.parallel({
			TotalCountApproved: function (callback) {
				db.query('SELECT count(CNIC) as TotalCountApproved from Beneficiary\
				WHERE BenStatusID = 4 ', null, callback)
			},
			TotalCounts: function (callback) {
				db.query('SELECT \
					SUM(CASE WHEN InstallmentType = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment1,\
					SUM(CASE WHEN InstallmentType = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment2,\
					SUM(CASE WHEN InstallmentType = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment3,\
					SUM(CASE WHEN InstallmentType = 4 THEN 1 ELSE 0 END) AS TotalCountInstallment4 \
				 FROM DistributedCheques ', null, callback)
			},
			TotalCountInstallment_ByUC: function (callback) {
				db.query('SELECT \
					SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment_Awaran,\
					SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gishkore,\
					SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment_Teertaje,\
					SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gajjar,\
					SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment_Nokjo,\
					SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment_Parwar,\
					SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment_Dandar \
					 FROM DistributedCheques \
					 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
					 WHERE DistributedCheques.InstallmentType = 4', null, callback)
			},
			TotalCountInstallment_ByUCnMonth: function (callback) {
				db.query('SELECT CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) as Month,\
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment_Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment_Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment_Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment_Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment_Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment_Dandar \
				 FROM DistributedCheques \
				 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
				 WHERE DistributedCheques.InstallmentType = 4 \
				 GROUP BY Month', null, callback)
			},
			Installment_DisbursementByUCnMonth: function (callback) {
				db.query('SELECT LUCs.UCName, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-03" THEN 1 ELSE 0 END) AS TotalCount0319, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-04" THEN 1 ELSE 0 END) AS TotalCount0419, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-05" THEN 1 ELSE 0 END) AS TotalCount0519, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-06" THEN 1 ELSE 0 END) AS TotalCount0619, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-07" THEN 1 ELSE 0 END) AS TotalCount0719, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-08" THEN 1 ELSE 0 END) AS TotalCount0819, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-09" THEN 1 ELSE 0 END) AS TotalCount0919, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-10" THEN 1 ELSE 0 END) AS TotalCount1019, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-11" THEN 1 ELSE 0 END) AS TotalCount1119, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-12" THEN 1 ELSE 0 END) AS TotalCount1219, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-01" THEN 1 ELSE 0 END) AS TotalCount0120, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-02" THEN 1 ELSE 0 END) AS TotalCount0220, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-03" THEN 1 ELSE 0 END) AS TotalCount0320, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-04" THEN 1 ELSE 0 END) AS TotalCount0420, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-05" THEN 1 ELSE 0 END) AS TotalCount0520, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-06" THEN 1 ELSE 0 END) AS TotalCount0620, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-07" THEN 1 ELSE 0 END) AS TotalCount0720, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-08" THEN 1 ELSE 0 END) AS TotalCount0820 \
					FROM DistributedCheques \
					LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
					LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
					WHERE DistributedCheques.InstallmentType = 4 \
					GROUP BY Beneficiary.UCID', null, callback)
			},
			TotalCountsInstallment_DisbursementByMonth: function (callback) {
				db.query('SELECT \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-03" THEN 1 ELSE 0 END) AS TotalCount0319, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-04" THEN 1 ELSE 0 END) AS TotalCount0419, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-05" THEN 1 ELSE 0 END) AS TotalCount0519, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-06" THEN 1 ELSE 0 END) AS TotalCount0619, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-07" THEN 1 ELSE 0 END) AS TotalCount0719, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-08" THEN 1 ELSE 0 END) AS TotalCount0819, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-09" THEN 1 ELSE 0 END) AS TotalCount0919, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-10" THEN 1 ELSE 0 END) AS TotalCount1019, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-11" THEN 1 ELSE 0 END) AS TotalCount1119, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2019-12" THEN 1 ELSE 0 END) AS TotalCount1219, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-01" THEN 1 ELSE 0 END) AS TotalCount0120, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-02" THEN 1 ELSE 0 END) AS TotalCount0220, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-03" THEN 1 ELSE 0 END) AS TotalCount0320, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-04" THEN 1 ELSE 0 END) AS TotalCount0420, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-05" THEN 1 ELSE 0 END) AS TotalCount0520, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-06" THEN 1 ELSE 0 END) AS TotalCount0620, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-07" THEN 1 ELSE 0 END) AS TotalCount0720, \
				SUM(CASE WHEN CONCAT(DATE_FORMAT(ChequeDate, "%Y"),"-", DATE_FORMAT(ChequeDate, "%m")) = "2020-08" THEN 1 ELSE 0 END) AS TotalCount0820 \
				FROM DistributedCheques \
				LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
				LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
				WHERE DistributedCheques.InstallmentType = 4 ', null, callback)
			},
			LastDisbursementOn: function (callback) {
				db.query('SELECT Date_format(max(CreateDate), \'%M %d, %Y\') as LD FROM DistributedCheques where InstallmentType=4', null, callback)
			},

		}, function (err, results) {
			if (err) {
				console.log(err.message);
				res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
			} else {
				//if (req.user.UserTypeID == 1) {
				res.render('pages/installment_details', {
					GraphTitle: '4th Installment Disbursement By Month',
					TableTitle: "Monthly Disbursement of 4th Installment",
					PointLabel: "Cheques disbursed to # of beneficiaries",
					TotalCountInstallment_: results.TotalCounts[0].TotalCountInstallment4,
					Installment: "4th",
					InstallmentAmount: "56,000.00",
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user,
					TotalCounts: results.TotalCounts[0],
					TotalCount: results.TotalCounts[0].TotalCountInstallment1 + results.TotalCounts[0].TotalCountInstallment2 + results.TotalCounts[0].TotalCountInstallment3 + results.TotalCounts[0].TotalCountInstallment4,
					TotalCountInstallment_ByUC: results.TotalCountInstallment_ByUC[0],
					TotalCountApproved: results.TotalCountApproved[0].TotalCountApproved,
					TotalCountInstallment_ByUCnMonth: results.TotalCountInstallment_ByUCnMonth,
					Installment_DisbursementByUCnMonth: results.Installment_DisbursementByUCnMonth,
					TotalCountsInstallment_DisbursementByMonth: results.TotalCountsInstallment_DisbursementByMonth[0],
					LastDisbursementOn: results.LastDisbursementOn[0].LD
				});
			}
		});

	}
});


module.exports = router;
