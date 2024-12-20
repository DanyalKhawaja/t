var express = require('express');
var router = express.Router();
var fs = require('fs');
var auth = require('./auth.js');
var passport = require('passport');

var async = require('async');
var db = require('../config/connection');
const glob = require('glob');

var lookups = require('../models/mdlLookupTables');
var user = require('../models/mdlUsers');
var mdlBeneficiary = require('../models/mdlBeneficiary');
var mdlCNICImages = require('../models/mdlCNICImages');
var mdlFaceImages = require('../models/mdlFaceImages');
var mdlHouseImages = require('../models/mdlHouseImages');
var mdlFingerImages = require('../models/mdlFingerImages');
var mdlUsersFP = require('../models/mdlUsersFP');
var mdlVillages = require('../models/mdlVillages');
let mdlLookupTables = require('../models/mdlLookupTables');
let mdlMonitoring = require('../models/mdlMonitoring');
let mdlDistributedCheques = require('../models/mdlDistributedCheques');
let currDate = new Date();
currDate.setHours(-72);
let LastUpdatedOn = currDate.toDateString().substr(4);
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {
		return next();
	}
	console.log(req.isAuthenticated());
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/landing');
}

/* GET login page. */
router.get('/landing', function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	res.render('pages/landing', { message: req.flash('message'), lang: req.session.lang });
});


/* GET login page. */
router.get('/login_c1', function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	res.render('pages/login_c1', { message: req.flash('message'), lang: req.session.lang });
});

/* GET login page. */
router.get('/login_c2', function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	res.render('pages/login_c2', { message: req.flash('message'), lang: req.session.lang });
});

/* GET login page. */
router.get('/login_c3', function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	res.render('pages/login_c3', { message: req.flash('message'), lang: req.session.lang });
});

router.get('/change_lang', function (req, res) {
	req.session.lang = req.query.lang;
	res.redirect(`/${req.query.page}`);
});
router.get('/note', function (req, res) {
	res.render('pages/note', { message: req.flash('message'), lang: req.session.lang });
});
/* GET MAIN page. */
router.get('/', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any

	// res.render('pages/main', {
	// 	message: req.flash('message'),
	// 	lang: req.session.lang,
	// 	User: req.user
	// });
	res.redirect('/hc-dashboard');
});

/* GET gallery page. */
router.get('/gallery', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		res.render('pages/gallery', {
			message: req.flash('message'),
			lang: req.session.lang,
			User: req.user
		});
	}
	
});

/* GET tasks list. */
// router.get('/plan12010203', isAuthenticated, function (req, res) {
// 	// Display the Login page with any flash message, if any
// 	console.log(req.user);
// 	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
// 		res.render('pages/page_not_found', { message: req.flash('message') });
// 	} else {
// 		res.render('pages/plan12010203', { message: req.flash('message'), lang: req.session.lang, User: req.user });
// 	}
// });
/* GET schedule of services. */
// router.get('/all-phases', isAuthenticated, function (req, res) {
// 	// Display the Login page with any flash message, if any
// 	//console.log(req.flash);
// 	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
// 		res.render('pages/page_not_found', { message: req.flash('message') });
// 	} else {
// 		res.render('pages/all-phases', { message: req.flash('message'), lang: req.session.lang, User: req.user });
// 	}
// });

router.get('/budget_spending', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		res.render('pages/budget_spending', { message: req.flash('message'), lang: req.session.lang, User: req.user });
	}
});

router.get('/s_curve', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		res.render('pages/s-curve', { message: req.flash('message'), lang: req.session.lang, User: req.user });
	}
});

router.get('/survey', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		res.render('pages/survey_stats', { message: req.flash('message'), lang: req.session.lang, User: req.user });
	}
});

router.get('/surveyreview', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		res.render('pages/survey_review', { message: req.flash('message'), lang: req.session.lang, User: req.user });
	}
});
router.get('/reports', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		res.render('pages/reports', { message: req.flash('message'), lang: req.session.lang, User: req.user });
	}
});

// router.get('/performance', isAuthenticated, function (req, res) {
// 	// Display the Login page with any flash message, if any
// 	//console.log(req.flash);
// 	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
// 		res.render('pages/page_not_found', { message: req.flash('message') });
// 	} else {
// 		res.render('pages/performance', { message: req.flash('message'), lang: req.session.lang, User: req.user });
// 	}
// });

router.get('/modelhouses', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6  || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		res.render('pages/ModelHouses', { message: req.flash('message'), lang: req.session.lang, User: req.user });
	}
});

router.get('/modelhouse/detail', isAuthenticated, function (req, res) {
	// Display the Login page with any flash message, if any
	//console.log(req.flash);
	if (req.user.UserTypeID == 4 || req.user.UserTypeID == 6) {
		res.render('pages/page_not_found', { message: req.flash('message') });
	} else {
		let ID = req.query.ID;


		db.query('SELECT ID, UCName, m.MHName, m.Latitude, m.Longitude, \
				VillageName, m.Status, m.Progress FROM ModelHouses as m \
				LEFT JOIN LUCs on m.UCID = LUCs.UCID \
				LEFT JOIN Villages on m.VillageID = Villages.VillageID \
				WHERE ID = ?', [ID], function (err, result) {
			if (err) {
				console.log(err.message);
				res.status(500).send(err.message);
			} else {
				glob('public/images/ModelHouses/' + result[0].MHName + '/*.jpg', {}, (err, files) => {
					if (err) {
						console.log(err.message);
					} else {
						res.render('pages/modelhouse_monitoring', {
							message: req.flash('message'),
							lang: req.session.lang,
							User: req.user,
							images: files,
							MHName: result[0].MHName,
							Completion: result[0].Progress
						});
					}
				});
			}
		});
		
	}
});


/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));



/* Handle Logout */
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});
/*
 * webservices that can be accessed by any one
 */
//Allows App Update
router.get("/api/download", function (req, res) {
	//var path=require('path');
	//var path = path.resolve(".")+'/AppUpdates/CDD.apk';
	path = "AppUpdates/HRA.apk";
	res.download(path);
});
//Check App Version
router.get("/api/check", function (req, res) {
	//var path=require('path');
	//var path = path.resolve(".")+'/AppUpdates/CDD.apk';
	path = "AppUpdates/AppVersion.txt";
	res.download(path);
});

router.post('/api/login', auth.login);
router.get('/api/users', user.getAll);
router.get('/api/lookups', function (req, res) {
	lookups.getAll(req, function (err, result) {
		res.send(result);
	});
});
router.get('/api/beneficiary', function (req, res) {
	mdlBeneficiary.getAll(req, function (err, result) {
		if (err) {
			res.send(err.message);
		}
		let json = "{\"Beneficiary\": " + JSON.stringify(result) + "}";
		res.send(json);
	});
});

router.get('/api/beneficiary_temp', function (req, res) {
	mdlBeneficiary.getAll(req, function (err, result) {
		if (err) {
			res.send(err.message);
		}
		let json = "{\"Beneficiary\": " + JSON.stringify(result) + "}";
		res.send(json);
	});
});

router.get('/payments', function (req, res) {
	db.query("select concat(upper(left(monthname(ChequeDate),3)), '-',year(ChequeDate)) mon,  sum(CASE WHEN InstallmentType=1 then 88000 when InstallmentType=2 then 66000 when InstallmentType=3 then 56000 when InstallmentType=4 then 50000 else 0 end) total from DistributedCheques dc group by mon order by mon", function (err, result) {
		if (err) {
			console.log(err.message);
			res.status(500).send(err.message);
		} else {
			res.json(result.reduce((payments, payment)=> { payments[payment.mon] = payment.total; return payments }, {}))
		}
	});
});

router.get('/earned', function (req, res) {
	db.query("select concat(upper(left(monthname(ChequeDate),3)), '-',year(ChequeDate)) mon,  sum(CASE WHEN InstallmentType=4 then 260000 else 0 end) total from DistributedCheques dc group by mon order by mon", function (err, result) {
		if (err) {
			console.log(err.message);
			res.status(500).send(err.message);
		} else {
			res.json(result.reduce((payments, payment)=> { payments[payment.mon] = payment.total; return payments }, {}))
		}
	});
});

router.get('/surveys', function (req, res) {
	db.query('select l.UCName uc, concat(upper(left(MONTHNAME(m.CreateDate),3)),"-",year(m.CreateDate)) month_year, count(*) total from Monitoring m , LUCs l where m.UCID = l.UCID group by uc, month_year  order by month_year', function (err, result) {
		if (err) {
			console.log(err.message);
			res.status(500).send(err.message);
		} else {
			res.json(result.reduce((surveys, survey)=> { 
				if(!surveys[survey.uc]){
					surveys[survey.uc] = { [survey.month_year] : survey.total };
				} else {
					surveys[survey.uc][survey.month_year] = survey.total;
				}

				 return surveys;
			 }
				 , {}))
		}
	});
});


router.get('/ucs', function (req, res) {
	db.query("select UCName from LUCs l ", function (err, result) {
		if (err) {
			console.log(err.message);
			res.status(500).send(err.message);
		} else {
			res.json(result)
		}
	});
});


// router.get('/api/benid', function (req, res) {
// 	mdlBeneficiary.getBenID(req, function (err, result) {
// 		if (err) {
// 			res.send(err.message);
// 		}
// 		let json = "{\"Beneficiary\": " + JSON.stringify(result) + "}";
// 		res.send(json);
// 	});
// });
router.post('/api/beneficiary', mdlBeneficiary.wsPost);
router.get('/api/cnic_images', mdlCNICImages.getAll);
router.post('/api/cnic_images', mdlCNICImages.wsPost);
router.get('/api/face_images', mdlFaceImages.getAll);
router.post('/api/face_images', mdlFaceImages.wsPost);
router.get('/api/house_images', mdlHouseImages.getAll);
router.post('/api/house_images', mdlHouseImages.wsPost);
router.get('/api/finger_images', mdlFingerImages.getAll);
router.post('/api/finger_images', mdlFingerImages.wsPost);

router.get('/api/users_fp', mdlUsersFP.getAll);
router.post('/api/users_fp', mdlUsersFP.wsPost);
router.get('/api/villages', function (req, res) {
	mdlVillages.getAll(req, function (err, result) {
		if (err) {
			res.send(err.message);
		}
		let json = "{\"Villages\": " + JSON.stringify(result) + "}";
		res.send(json);
	});
});
router.post('/api/monitoring', mdlMonitoring.wsPost);
router.get('/api/monitoring', function (req, res) {
	mdlMonitoring.getAll(req, function (err, result) {
		if (err) {
			res.send(err.message);
		} else {
			console.log(result.length);
			let json = "{\"Monitoring\": " + JSON.stringify(result) + "}";
			res.send(json);
		}
	});
});
router.post('/api/distributed_cheques', mdlDistributedCheques.wsPost);
router.get('/api/distributed_cheques', function (req, res) {
	mdlDistributedCheques.getAll(req, function (err, result) {
		if (err) {
			res.send(err.message);
		} else {
			let json = "{\"DistributedCheques\": " + JSON.stringify(result) + "}";
			res.send(json);
		}
	});
});
router.post('/api/villages', mdlVillages.wsPost);

/*
 * webservice Routes that can be accessed only by authenticated & authorized users
 */

// router.post('/api/v1/users', user.wsPost);
// router.get('/api/v1/admin/user/:id', user.getOne);

router.get('/hc-dashboard', isAuthenticated, function (req, res) {

	console.log("Redirecting to main page...");
	if (req.user.UserTypeID == 4) {
		res.render('pages/beneficiary-cnic', {
			message: req.flash('message'),
			CNICImageFront: "",
			CNICImageBack: "",
			Permission: 1,
			UserType: req.user.UserTypeID,
			User: req.user,
			lang: req.session.lang
		});
	} else if (req.user.UserTypeID == 7) {
		res.render('pages/beneficiary_2', {
			message: req.flash('message'),
			CNICImageFront: "",
			CNICImageBack: "",
			Permission: 1,
			UserType: req.user.UserTypeID,
			User: req.user,
			lang: req.session.lang
		});
	} else if (req.user.UserTypeID == 6) {
		res.render('pages/beneficiary_1', {
			message: req.flash('message'),
			CNICImageFront: "",
			CNICImageBack: "",
			Permission: 1,
			UserType: req.user.UserTypeID,
			User: req.user,
			lang: req.session.lang
		});
	} else {
		async.series({
			TotalBeneficiaries: function (callback) {
				mdlBeneficiary.getTotalCount(req, callback)
			},
			TotalUnverified: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary where BenStatusID = 1', null, callback)
			},
			TotalNomads: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary where BenStatusID = 1 and DistrictID = 0', null, callback)
			},
			TotalPending: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary WHERE BenStatusID = 2', null, callback)
			},
			TotalVerified: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary WHERE BenStatusID = 3', null, callback)
			},
			TotalApproved: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary WHERE BenStatusID = 4', null, callback)
			},
			TotalRejected: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary WHERE BenStatusID = 5', null, callback)
			},
			TotalDubious: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary WHERE BenStatusID = 6', null, callback)
			},
			TotalSubstituted: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary WHERE IsNew = 1', null, callback)
			},
			TotalDeceased: function (callback) {
				db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary WHERE BenStatusID = 7', null, callback)
			},
			TotalLevel1Encashed: function (callback) {
				db.query('SELECT count(distinct(CNIC)) as count from DistributedCheques WHERE InstallmentType = 1', null, callback)
			},
			TotalLevel2Encashed: function (callback) {
				db.query('SELECT count(distinct(CNIC)) as count from DistributedCheques WHERE InstallmentType = 2', null, callback)
			},
			TotalLevel3Encashed: function (callback) {
				db.query('SELECT count(distinct(CNIC)) as count from DistributedCheques WHERE InstallmentType = 3', null, callback)
			},
			TotalLevel4Encashed: function (callback) {
				db.query('SELECT count(distinct(CNIC)) as count from DistributedCheques WHERE InstallmentType = 4', null, callback)
			},
			TotalLevel1Achieved: function (callback){
				db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
				WHERE MonitoringLevel = 1 AND LevelStatus = 2 ', null, callback)
			},
			TotalLevel2Achieved: function (callback){
				db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
				WHERE MonitoringLevel = 2 AND LevelStatus = 2 ', null, callback)
			},
			TotalLevel1InProgress: function (callback){
				db.query('with aa as (SELECT CNIC, MonitoringLevel, max(LevelStatus)  as level \
					FROM Monitoring group by CNIC, MonitoringLevel having level = 1 and MonitoringLevel = 1) select count(*) as count from aa', null, callback)
			},
			TotalLevel2InProgress: function (callback){
				db.query('with aa as (SELECT CNIC, MonitoringLevel, max(LevelStatus)  as level \
					FROM Monitoring group by CNIC, MonitoringLevel having level = 1 and MonitoringLevel = 2) select count(*) as count from aa', null, callback)
			},
			TotalLevel3InProgress: function (callback){
				db.query('with aa as (SELECT CNIC, MonitoringLevel, max(LevelStatus)  as level \
					FROM Monitoring group by CNIC, MonitoringLevel having level = 1 and MonitoringLevel = 3) select count(*) as count from aa', null, callback)
			},
			TotalLevel4InProgress: function (callback){
				db.query('with aa as (SELECT CNIC, MonitoringLevel, max(LevelStatus)  as level \
					FROM Monitoring group by CNIC, MonitoringLevel having level = 1 and MonitoringLevel = 4) select count(*) as count from aa', null, callback)
			},
			// Last2Recomended: function (callback){
			// 	// db.query('select SubmittedOn, count(*) as count from Recomended \
			// 	// group by SubmittedOn order by SubmittedOn desc limit 2', null, callback)
			// 	db.query('select count(*) as count from Recomended', null, callback)
			// },
			NotRecomendedPaymentL2: function (callback){
				db.query('select count(*) as count from DistributedCheques \
				where DistributedCheques.InstallmentType = 2 and  DistributedCheques.CNIC not in (select Monitoring.CNIC from Monitoring where Monitoring.MonitoringLevel=1 and Monitoring.LevelStatus=2) ;', null, callback)
			},
			NotRecomendedPaymentL3: function (callback){
				db.query('select count(*) as count from DistributedCheques \
				where DistributedCheques.InstallmentType = 3 and  DistributedCheques.CNIC not in (select Monitoring.CNIC from Monitoring where Monitoring.MonitoringLevel=2 and Monitoring.LevelStatus=2) ;', null, callback)
			},
			NotRecomendedPaymentL4: function (callback){
				db.query('select count(*) as count from DistributedCheques \
				where DistributedCheques.InstallmentType = 4 and  DistributedCheques.CNIC not in (select Monitoring.CNIC from Monitoring where Monitoring.MonitoringLevel=3 and Monitoring.LevelStatus=2) ;', null, callback)
			},
			TotalLevel3Achieved: function (callback){
				db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
				WHERE MonitoringLevel = 3 AND LevelStatus = 2 ', null, callback)
			},
			TotalLevel4Achieved: function (callback){
				db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
				WHERE MonitoringLevel = 4 AND LevelStatus = 2 ', null, callback)
			},
			TotalCountLevel2AcheivedByUC: function (callback) {
				db.query('SELECT \
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment2Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment2Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment2Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment2Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment2Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment2Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment2Dandar \
				 FROM Monitoring \
				 LEFT JOIN Beneficiary on Monitoring.CNIC = Beneficiary.CNIC \
				 WHERE Monitoring.MonitoringLevel = 2 AND Monitoring.LevelStatus = 2', null, callback)
			},
			TotalCountInstallment2EncashedByUC: function (callback) {
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
			TotalCountLevel3AcheivedByUC: function (callback) {
				db.query('SELECT \
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment3Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment3Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment3Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment3Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment3Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment3Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment3Dandar \
				 FROM Monitoring \
				 LEFT JOIN Beneficiary on Monitoring.CNIC = Beneficiary.CNIC \
				 WHERE Monitoring.MonitoringLevel = 3 AND Monitoring.LevelStatus = 2', null, callback)
			},
			TotalCountInstallment3EncashedByUC: function (callback) {
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
					 WHERE DistributedCheques.InstallmentType = 3', null, callback)
			},
			TotalCountLevel4AcheivedByUC: function (callback) {
				db.query('SELECT \
				SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment4Awaran,\
				SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment4Gishkore,\
				SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment4Teertaje,\
				SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment4Gajjar,\
				SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment4Nokjo,\
				SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment4Parwar,\
				SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment4Dandar \
				 FROM Monitoring \
				 LEFT JOIN Beneficiary on Monitoring.CNIC = Beneficiary.CNIC \
				 WHERE Monitoring.MonitoringLevel = 4 AND Monitoring.LevelStatus = 2', null, callback)
			},
			TotalCountInstallment4EncashedByUC: function (callback) {
				db.query('SELECT \
					SUM(CASE WHEN Beneficiary.UCID = 1 THEN 1 ELSE 0 END) AS TotalCountInstallment4Awaran,\
					SUM(CASE WHEN Beneficiary.UCID = 2 THEN 1 ELSE 0 END) AS TotalCountInstallment4Gishkore,\
					SUM(CASE WHEN Beneficiary.UCID = 3 THEN 1 ELSE 0 END) AS TotalCountInstallment4Teertaje,\
					SUM(CASE WHEN Beneficiary.UCID = 6 THEN 1 ELSE 0 END) AS TotalCountInstallment4Gajjar,\
					SUM(CASE WHEN Beneficiary.UCID = 7 THEN 1 ELSE 0 END) AS TotalCountInstallment4Nokjo,\
					SUM(CASE WHEN Beneficiary.UCID = 8 THEN 1 ELSE 0 END) AS TotalCountInstallment4Parwar,\
					SUM(CASE WHEN Beneficiary.UCID = 9 THEN 1 ELSE 0 END) AS TotalCountInstallment4Dandar \
					 FROM DistributedCheques \
					 LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
					 WHERE DistributedCheques.InstallmentType = 4', null, callback)
			},
			LastDataReceivedOn: function (callback) {
				db.query('SELECT Date_format(max(CreateDate), \'%M %d, %Y\') as LD FROM Monitoring ', null, callback)
			},
			LastDisbursementOn: function (callback) {
				db.query('SELECT Date_format(max(CreateDate), \'%M %d, %Y\') as LD FROM DistributedCheques ', null, callback)
			},
		}, function (err, results) {
			console.log("queries done");
			if (err) {
				console.log(err.message);
				res.render('pages/page_not_found', { message: req.flash('message'), lang: req.session.lang });
			}

			res.render('pages/index', {
				title: "hc-dashboard",
				TotalBeneficiaries: results.TotalBeneficiaries[0].count,
				TotalUnverified: results.TotalUnverified[0].count,
				TotalNomads: results.TotalNomads[0].count,
				TotalPending: results.TotalPending[0].count,
				TotalApproved: results.TotalApproved[0].count,
				TotalVerified: results.TotalVerified[0].count,
				TotalRejected: results.TotalRejected[0].count,
				TotalDubious: results.TotalDubious[0].count,
				TotalSubstituted: results.TotalSubstituted[0].count,
				TotalDeceased: results.TotalDeceased[0].count,
				TotalLevel1Encashed: results.TotalLevel1Encashed[0].count,
				TotalLevel2Encashed: results.TotalLevel2Encashed[0].count,
				TotalLevel3Encashed: results.TotalLevel3Encashed[0].count,
				TotalLevel4Encashed: results.TotalLevel4Encashed[0].count,
				TotalLevel1Achieved: results.TotalLevel1Achieved[0].count,
				TotalLevel2Achieved: results.TotalLevel2Achieved[0].count,
				TotalLevel3Achieved: results.TotalLevel3Achieved[0].count,
				TotalLevel4Achieved: results.TotalLevel4Achieved[0].count,

				TotalLevel1InProgress:  results.TotalLevel1InProgress[0].count+results.TotalLevel1Achieved[0].count,
				TotalLevel2InProgress:  results.TotalLevel2InProgress[0].count+results.TotalLevel2Achieved[0].count,
				TotalLevel3InProgress:  results.TotalLevel3InProgress[0].count+results.TotalLevel3Achieved[0].count,
				TotalLevel4InProgress: results.TotalLevel4InProgress[0].count+results.TotalLevel4Achieved[0].count,

				TotalLevel1Encashedp: (results.TotalLevel1Encashed[0].count/8000)*100,
				TotalLevel2Encashedp: (results.TotalLevel2Encashed[0].count/8000)*100,
				TotalLevel3Encashedp: (results.TotalLevel3Encashed[0].count/8000)*100,
				TotalLevel4Encashedp: (results.TotalLevel4Encashed[0].count/8000)*100,
				TotalLevel1Achievedp: (results.TotalLevel1Achieved[0].count/8000)*100,
				TotalLevel2Achievedp: (results.TotalLevel2Achieved[0].count/8000)*100,
				TotalLevel3Achievedp: (results.TotalLevel3Achieved[0].count/8000)*100,
				TotalLevel4Achievedp: (results.TotalLevel4Achieved[0].count/8000)*100,


				TotalLevel1InProgressp: ((results.TotalLevel1InProgress[0].count+results.TotalLevel1Achieved[0].count)/8000)*100,
				TotalLevel2InProgressp: ((results.TotalLevel2InProgress[0].count+results.TotalLevel2Achieved[0].count)/8000)*100,
				TotalLevel3InProgressp: ((results.TotalLevel3InProgress[0].count+results.TotalLevel3Achieved[0].count)/8000)*100,
				TotalLevel4InProgressp: ((results.TotalLevel4InProgress[0].count+results.TotalLevel4Achieved[0].count)/8000)*100,




				// Last2Recomended: results.Last2Recomended[0].count,
				NotRecomendedPaymentL2: results.NotRecomendedPaymentL2[0].count,
				NotRecomendedPaymentL3: results.NotRecomendedPaymentL3[0].count,
				NotRecomendedPaymentL4: results.NotRecomendedPaymentL4[0].count,
				TotalCountInstallment2EncashedByUC: results.TotalCountInstallment2EncashedByUC[0],
				TotalCountLevel2AcheivedByUC: results.TotalCountLevel2AcheivedByUC[0],
				TotalCountInstallment3EncashedByUC: results.TotalCountInstallment3EncashedByUC[0],
				TotalCountLevel3AcheivedByUC: results.TotalCountLevel3AcheivedByUC[0],
				TotalCountInstallment4EncashedByUC: results.TotalCountInstallment4EncashedByUC[0],
				TotalCountLevel4AcheivedByUC: results.TotalCountLevel4AcheivedByUC[0],
				lang: req.session.lang,
				User: req.user,
				LastDataReceivedOn: results.LastDataReceivedOn[0].LD,
				LastDisbursementOn: results.LastDisbursementOn[0].LD,
				LastUpdatedOn: LastUpdatedOn
			});
		});
	}

});

router.get('/gis', isAuthenticated, function (req, res) {

	if (req.user.UserTypeID == 4) {
		res.render('pages/beneficiary-cnic', {
			message: req.flash('message'),
			CNICImageFront: "",
			CNICImageBack: "",
			Permission: 1,
			UserType: req.user.UserTypeID,
			User: req.user,
			lang: req.session.lang
		});
	} else if (req.user.UserTypeID == 6 || req.user.UserTypeID == 7) {
		res.render('pages/page_not_found', {
			message: req.flash('message'),
			CNICImageFront: "",
			CNICImageBack: "",
			Permission: 1,
			UserType: req.user.UserTypeID,
			User: req.user,
			lang: req.session.lang
		});
	} else {
		async.series({
			Beneficiaries: function (callback) {
				mdlBeneficiary.getAllUCs(req, callback)
			},
			TotalBeneficiaries: function (callback) {
				mdlBeneficiary.getTotalCount(req, callback)
			},
			Lookups: function (callback) {
				mdlLookupTables.getAll(req, callback)
			},
			Villages: function (callback) {
				mdlVillages.getAll(req, callback)
			},
			CountNotStarted: function (callback) {
				db.query('SELECT count(CNIC) as count from Beneficiary where BenStatusID=4 and  CNIC not in (select distinct CNIC from Monitoring)', null, callback)
			},
			CountLevel4Achieved: function (callback) {
				db.query('SELECT count(CNIC) as count from Monitoring where MonitoringLevel = 4 AND LevelStatus = 2', null, callback)
			}
		}, function (err, results) {
			console.log("queries done");
			if (err) {
				console.log(err.message);
				res.render('pages/page_not_found', { message: req.flash('message') });
			} else {

				res.render('pages/gis', {
					Beneficiaries: results.Beneficiaries,
					TotalBeneficiaries: results.TotalBeneficiaries[0].count,
					CountNotStarted: results.CountNotStarted[0].count,
					CountLevel4Achieved: results.CountLevel4Achieved[0].count,
					UCs: results.Lookups.lookups.LUCs,
					Villages: results.Villages,
					lang: req.session.lang,
					User: req.user,
					LastUpdatedOn: LastUpdatedOn
				});
			}
		});
	}

});

router.get('/getIndicatorsByTehsil', isAuthenticated, function (req, res) {
	var TehsilID = 0;
	let Tehsils = { "Awaran": 1, "Mashkai": 3, "Hoshab": 4,"Gishkore":5};
	TehsilID = Tehsils[req.query.Tehsil];

	async.series({
		TotalBeneficiaries: function (callback) {
			db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary where (BenStatusID=4 or BenStatusID=3) and  TehsilID = ?', [TehsilID], callback)
		},
		TotalUnverified: function (callback) {
			db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary \
				WHERE BenStatusID = 1 AND TehsilID = ?', [TehsilID], callback)
		},
		TotalPending: function (callback) {
			db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary \
				WHERE BenStatusID = 2 AND TehsilID = ?', [TehsilID], callback)
		},
		TotalVerified: function (callback) {
			db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary \
				WHERE BenStatusID = 3 AND TehsilID = ?', [TehsilID], callback)
		},
		TotalApproved: function (callback) {
			db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary \
				WHERE BenStatusID = 4 AND TehsilID = ?', [TehsilID], callback)
		},
		TotalRejected: function (callback) {
			db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary \
				WHERE BenStatusID = 5 AND TehsilID = ?', [TehsilID], callback)
		},
		TotalDubious: function (callback) {
			db.query('SELECT IFNULL(count(CNIC),0) as count from Beneficiary \
				WHERE BenStatusID = 6 AND TehsilID = ?', [TehsilID], callback)
		},
		TotalLevel1Encashed: function (callback) {
			db.query('SELECT count(DistributedCheques.CNIC) as count FROM DistributedCheques \
			LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			where InstallmentType = 1 and TehsilID = ?', [TehsilID], callback)
		},
		TotalLevel1Achieved: function (callback){
			db.query('SELECT count(distinct(Monitoring.CNIC)) as count \
			from Monitoring \
			WHERE MonitoringLevel = 1 AND LevelStatus = 2 AND TehsilID = ?', [TehsilID], callback)
		},
		TotalLevel2Encashed: function (callback) {
			db.query('SELECT count(distinct(DistributedCheques.CNIC)) as count from DistributedCheques \
			LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			WHERE InstallmentType = 2 \
			AND TehsilID = ?', [TehsilID], callback)
		},
		TotalLevel2Achieved: function (callback){
			db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
			WHERE MonitoringLevel = 2 AND LevelStatus = 2 AND TehsilID = ? ', [TehsilID], callback)
		},
		TotalLevel3Encashed: function (callback) {
			db.query('SELECT count(distinct(DistributedCheques.CNIC)) as count from DistributedCheques \
			LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			WHERE InstallmentType = 3 \
			AND TehsilID = ?', [TehsilID], callback)
		},
		TotalLevel3Achieved: function (callback){
			db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
			WHERE MonitoringLevel = 3 AND LevelStatus = 2 AND TehsilID = ? ', [TehsilID], callback)
		},
		TotalLevel4Encashed: function (callback) {
			db.query('SELECT count(distinct(DistributedCheques.CNIC)) as count from DistributedCheques \
			LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			WHERE InstallmentType = 4 \
			AND TehsilID = ?', [TehsilID], callback)
		},
		TotalLevel4Achieved: function (callback){
			db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
			WHERE MonitoringLevel = 4 AND LevelStatus = 2 AND TehsilID = ? ', [TehsilID], callback)
		},
		TotalLevel1InProgress: function (callback){
			db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
			WHERE MonitoringLevel = 1 AND LevelStatus = 1 AND TehsilID = ? ', [TehsilID], callback)
		},
		TotalLevel2InProgress: function (callback){
			db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
			WHERE MonitoringLevel = 2 AND LevelStatus = 1 AND TehsilID = ? ', [TehsilID], callback)
		},
		TotalLevel3InProgress: function (callback){
			db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
			WHERE MonitoringLevel = 3 AND LevelStatus = 1 AND TehsilID = ? ', [TehsilID], callback)
		},
		TotalLevel4InProgress: function (callback){
			db.query('SELECT count(distinct(CNIC)) as count FROM Monitoring \
			WHERE MonitoringLevel = 4 AND LevelStatus = 1 AND TehsilID = ? ', [TehsilID], callback)
		},
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.send(0);
		} else {
			res.send(results);
		}
	});
});

router.get('/levelAchieved', isAuthenticated, function(req, res) {
	// Display the Login page with any flash message, if any
  //console.log(req.flash);
  if(req.user.UserTypeID == 4  || req.user.UserTypeID == 6 || req.user.UserTypeID == 7){
	  res.render('pages/page_not_found', { message: req.flash('message') });
  } else {
		async.parallel({
			// TotalCountEncashed: function (callback) {
			// 	db.query('SELECT count(DISTINCT(CNIC)) as count from DistributedCheques \
			// 	WHERE InstallmentType = 1 ', null, callback)
			// },
			// TotalCount: function (callback) {
			// 	db.query('SELECT \
			// 			count(DISTINCT(CNIC)) as count \
			// 	 		FROM Monitoring WHERE MonitoringLevel = 1 AND LevelStatus = 2 ', null, callback)
			// },
			UCs: function (callback) {
				db.query('select UCName FROM LUCs ', null, callback)
			},
			TotalCountLevelAcheivedByUC: function (callback) {
				db.query('select Count, UCName ,	MonitoringLevel from (SELECT count(UCID) as Count, UCID, MonitoringLevel FROM Monitoring where LevelStatus=2  group by UCID, MonitoringLevel order by UCID, MonitoringLevel) as ll, LUCs where ll.UCID = LUCs.UCID', null, callback)
			},
			TotalCountLevelAcheivedByMonth: function (callback) {
				db.query('SELECT count(CreateDate) as Count, upper(Date_format(CreateDate, \'%b-%Y\')) as CD, MonitoringLevel FROM Monitoring where LevelStatus=2 group by CD, MonitoringLevel order by CD, MonitoringLevel', null, callback)
			},
			LastDataReceivedOn: function (callback) {
				db.query('SELECT Date_format(max(CreateDate), \'%M %d, %Y\') as LD FROM Monitoring ', null, callback)
			},

		}, function (err, results) {
			if (err) {
				console.log(err.message);
				res.render('pages/not_authorized', {error_flag: true, save_error: err.message});
			} else {
				//if (req.user.UserTypeID == 1) {

					res.render('pages/levelAchieved', {
						message: req.flash('message'),
						Permission: 1,
						lang: req.session.lang,
						User: req.user,
						//TotalCountEncashed: results.TotalCountEncashed[0].count,
						//TotalCount: results.TotalCount[0].count,
						TotalCountLevelAcheivedByUC: results.TotalCountLevelAcheivedByUC,
						TotalCountLevelAcheivedByMonth: results.TotalCountLevelAcheivedByMonth,
						LastUpdatedOn: LastUpdatedOn,
						LastDataReceivedOn: results.LastDataReceivedOn[0].LD,
						UCs: results.UCs
					});
			}
		});	
	  
  }
});

module.exports = router;
