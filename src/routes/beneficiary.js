var express = require('express');
var router = express.Router();
var db = require('../config/connection');
var async = require('async');
var ByteBuffer = require('byte-buffer');
var resizeImage = require('resize-image');

let mdlBeneficiary = require('../models/mdlBeneficiary');
let mdlFaceImages = require('../models/mdlFaceImages');
let mdlLookupTables = require('../models/mdlLookupTables');
let mdlVillages = require('../models/mdlVillages');
let mdlCNICImages = require('../models/mdlCNICImages');
let mdlHouseImages = require('../models/mdlHouseImages');
let mdlMonitoring = require('../models/mdlMonitoring');

const imageThumbnail = require('image-thumbnail');
let ThumbnailOptions = { percentage: 25, responseType: 'base64' };

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
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
		} else {
			//if (req.user.UserTypeID == 1) {
			if (req.user.UserTypeID == 4) {
				res.render('pages/beneficiary-cnic', {
					CNICImageFront: "",
					CNICImageBack: "",
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user
				});
			} else if (req.user.UserTypeID == 6) {
				res.render('pages/beneficiary_1', {
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user
				});
			} else if (req.user.UserTypeID != 0) {
				res.render('pages/beneficiary', {
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user
				});
			} else {
				res.render('pages/page_not_found', {
					message: req.flash('not authorized!'),
					UserRoles: req.user.UserTypeID
				});
			}
		}
	});

});

router.get('/verified', isAuthenticated, function (req, res) {
	async.parallel({
		Districts: function (callback) {
			mdlBeneficiary.getAll(req, callback)
		},
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
		} else {
			//if (req.user.UserTypeID == 1) {
			if (req.user.UserTypeID == 4) {
				res.render('pages/beneficiary-cnic', {
					CNICImageFront: "",
					CNICImageBack: "",
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user
				});
			} else if (req.user.UserTypeID == 6) {
				res.render('pages/beneficiary_1', {
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user
				});
			} else if (req.user.UserTypeID != 0) {
				res.render('pages/beneficiary_v', {
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user
				});
			} else {
				res.render('pages/page_not_found', {
					message: req.flash('not authorized!'),
					UserRoles: req.user.UserTypeID
				});
			}
		}
	});

});

router.get('/cnic-crop', isAuthenticated, function (req, res) {
	async.parallel({
		Districts: function (callback) {
			mdlBeneficiary.getAll(req, callback)
		},
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
		} else {
			//if (req.user.UserTypeID == 1) {
			if (1) {
				res.render('pages/beneficiary-cnic', {
					message: req.flash('message'),
					CNICImageFront: "",
					CNICImageBack: "",
					Permission: 1,
					UserType: req.user.UserTypeID,
					lang: req.session.lang,
					User: req.user
				});
			} else {
				var CNICImageFront = "";
				res.render('pages/not_authorized', {
					message: req.flash('message'),
					UserRoles: results.UserRoles[0],
					UserType: req.user.UserTypeID
				});
			}
		}
	});

});

router.get('/report', isAuthenticated, function (req, res) {
	async.parallel({
		Beneficiary: function (callback) {
			mdlBeneficiary.getAll(req, callback)
		},
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
		} else {
			//if (req.user.UserTypeID == 1) {
			if (1) {
				res.render('pages/report', {
					message: req.flash('message'),
					Permission: 1,
					lang: req.session.lang,
					User: req.user
				});
			} else {
				res.render('pages/not_authorized', {
					message: req.flash('message'),
					UserRoles: results.UserRoles[0]
				});
			}
		}
	});
});

router.get('/map', isAuthenticated, function (req, res) {
	async.parallel({
		Beneficiary: function (callback) {
			mdlBeneficiary.getAll(req, callback)
		},
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.render('pages/not_authorized', { error_flag: true, save_error: err.message });
		} else {
			//if (req.user.UserTypeID == 1) {
			res.render('pages/map', {
				message: req.flash('message'),
				Permission: 1,
				lang: req.session.lang,
				User: req.user
			});

		}
	});
});

router.get('/detail', isAuthenticated, function (req, res) {
	//const timer = ms => new Promise( res => setTimeout(res, ms));
	if (req.user.UserTypeID == 6) {
		req.CNIC = req.query.CNIC;
		async.parallel({
			Beneficiary: function (callback) {
				mdlBeneficiary.getOne(req, callback)
			},
			CNICImages: function (callback) {
				mdlCNICImages.getOne(req, callback)
			},
			Lookups: function (callback) {
				mdlLookupTables.getAll(req, callback)
			},
			Villages: function (callback) {
				mdlVillages.getAll(req, callback)
			},
			Monitoring: function (callback) {
				mdlMonitoring.getAll(req, callback)
			}
		}, function (err, results) {
			var CNICFrontImage = "";
			if (results.CNICImages.length > 0) {
				if (results.CNICImages[0].CNICFront.length > 350437) {
					CNICFrontImage = results.CNICImages[0].CNICFront.toString();
				} else {
					CNICFrontImage = results.CNICImages[0].CNICFront.toString('base64');
				}
			}
			res.render('pages/beneficiary_detail_2', {
				message: req.flash('message'),
				Permission: 1,
				Beneficiary: results.Beneficiary[0],
				FaceImage: CNICFrontImage,
				Districts: results.Lookups.lookups.LDistricts,
				Tehsils: results.Lookups.lookups.LTehsils,
				UCs: results.Lookups.lookups.LUCs,
				BenStatus: results.Lookups.lookups.LBenStatus,
				Villages: results.Villages,
				HouseTypes: results.Lookups.lookups.LHouseTypes,
				UserType: req.user.UserTypeID,
				Monitoring: results.Monitoring[0],
				lang: req.session.lang,
				User: req.user
			});

		});
	} else if (req.user.UserTypeID == 4) {
		req.CNIC = req.query.CNIC;
		async.parallel({
			Beneficiary: function (callback) {
				mdlBeneficiary.getOne(req, callback)
			},
			FaceImages: function (callback) {
				mdlFaceImages.getOne(req, callback)
			},
			Lookups: function (callback) {
				mdlLookupTables.getAll(req, callback)
			},
			Villages: function (callback) {
				mdlVillages.getAll(req, callback)
			},
			Monitoring: function (callback) {
				mdlMonitoring.getAll(req, callback)
			}
		}, function (err, results) {
			var FaceImage = "";
			if (results.FaceImages.length > 0) {
				if (results.FaceImages[0].FaceImage.length > 350437) {
					FaceImage = results.FaceImages[0].FaceImage.toString();
				} else {
					FaceImage = results.FaceImages[0].FaceImage.toString('base64');
				}
			}
			res.render('pages/beneficiary_detail_1', {
				message: req.flash('message'),
				Permission: 1,
				Beneficiary: results.Beneficiary[0],
				FaceImage: FaceImage,
				Districts: results.Lookups.lookups.LDistricts,
				Tehsils: results.Lookups.lookups.LTehsils,
				UCs: results.Lookups.lookups.LUCs,
				BenStatus: results.Lookups.lookups.LBenStatus,
				Villages: results.Villages,
				HouseTypes: results.Lookups.lookups.LHouseTypes,
				UserType: req.user.UserTypeID,
				lang: req.session.lang,
				User: req.user
			});

		});
	} else {
		req.CNIC = req.query.CNIC;
		async.parallel({
			Beneficiary: function (callback) {
				mdlBeneficiary.getOne(req, callback)
			},
			FaceImages: function (callback) {
				mdlFaceImages.getOne(req, callback)
			},
			Lookups: function (callback) {
				mdlLookupTables.getAll(req, callback)
			},
			Villages: function (callback) {
				mdlVillages.getAll(req, callback)
			},
			Monitoring: function (callback) {
				mdlMonitoring.getAllByCNIC(req, callback)
			},
			MonitoringLevel1: function (callback) {
				db.query('SELECT max(Monitoring.CreateDate), LLevelStatus.LevelStatusDesc as LevelStatus \
				from Monitoring LEFT JOIN LLevelStatus on Monitoring.LevelStatus = LLevelStatus.LevelStatusID \
				WHERE Monitoring.CNIC = ? AND Monitoring.MonitoringLevel = 1 \
				GROUP by Monitoring.CNIC, Monitoring.LevelStatus', [req.CNIC], callback)
			},
			MonitoringLevel2: function (callback) {
				db.query('SELECT max(Monitoring.CreateDate), LLevelStatus.LevelStatusDesc as LevelStatus \
				from Monitoring LEFT JOIN LLevelStatus on Monitoring.LevelStatus = LLevelStatus.LevelStatusID \
				WHERE Monitoring.CNIC = ? AND Monitoring.MonitoringLevel = 2 \
				GROUP by Monitoring.CNIC, Monitoring.LevelStatus', [req.CNIC], callback)
			},
			MonitoringLevel3: function (callback) {
				db.query('SELECT max(Monitoring.CreateDate), LLevelStatus.LevelStatusDesc as LevelStatus \
				from Monitoring LEFT JOIN LLevelStatus on Monitoring.LevelStatus = LLevelStatus.LevelStatusID \
				WHERE Monitoring.CNIC = ? AND Monitoring.MonitoringLevel = 3 \
				GROUP by Monitoring.CNIC, Monitoring.LevelStatus', [req.CNIC], callback)
			},
			MonitoringLevel4: function (callback) {
				db.query('SELECT max(Monitoring.CreateDate), LLevelStatus.LevelStatusDesc as LevelStatus \
				from Monitoring LEFT JOIN LLevelStatus on Monitoring.LevelStatus = LLevelStatus.LevelStatusID \
				WHERE Monitoring.CNIC = ? AND Monitoring.MonitoringLevel = 4 \
				GROUP by Monitoring.CNIC, Monitoring.LevelStatus', [req.CNIC], callback)
			}
		}, function (err, results) {
			if (err) {
				console.log(err.message);
			}
			var FaceImage = "";
			var CNICImageFront = "";
			var CNICImageBack = "";
			var HouseFrontImagePhaseI = "";
			var HouseSideImagePhaseI = "";

			if (results.FaceImages.length > 0) {
				if (results.FaceImages[0].FaceImage.length > 350437) {
					FaceImage = results.FaceImages[0].FaceImage.toString('base64');
				} else {
					FaceImage = results.FaceImages[0].FaceImage.toString('base64');
				}
			}

			var Level1Status = "Not started";
			var Level2Status = "Not started";
			var Level3Status = "Not started";
			var Level4Status = "Not started";
			var progress = 0;

			console.log(results.MonitoringLevel4);
			if (results.MonitoringLevel1) {
				if (results.MonitoringLevel1.length > 0) {
					Level1Status = results.MonitoringLevel1[results.MonitoringLevel1.length - 1].LevelStatus;
					if (Level1Status == 'In Progress') {
						progress = 12.5;
					} else if (Level1Status == 'Achieved') {
						progress = 25;
					}
				}

			}
			if (results.MonitoringLevel2) {
				if (results.MonitoringLevel2.length > 0) {
					Level2Status = results.MonitoringLevel2[results.MonitoringLevel2.length - 1].LevelStatus;
					if (Level2Status == 'In Progress') {
						progress = 37;
					} else if (Level2Status == 'Achieved') {
						progress = 50;
					}
				}
			}
			if (results.MonitoringLevel3) {
				if (results.MonitoringLevel3.length > 0) {
					Level3Status = results.MonitoringLevel3[results.MonitoringLevel3.length - 1].LevelStatus;
					if (Level3Status == 'In Progress') {
						progress = 62;
					} else if (Level3Status == 'Achieved') {
						progress = 75;
					}
				}
			}
			if (results.MonitoringLevel4) {
				if (results.MonitoringLevel4.length > 0) {
					Level4Status = results.MonitoringLevel4[results.MonitoringLevel4.length - 1].LevelStatus;
					if (Level4Status == 'In Progress') {
						progress = 87;
					} else if (Level4Status == 'Achieved') {
						progress = 100;
					}
				}
			}

			res.render('pages/beneficiary_detail', {
				message: req.flash('message'),
				Permission: 1,
				Beneficiary: results.Beneficiary[0],
				FaceImage: FaceImage,
				Districts: results.Lookups.lookups.LDistricts,
				Tehsils: results.Lookups.lookups.LTehsils,
				UCs: results.Lookups.lookups.LUCs,
				BenStatus: results.Lookups.lookups.LBenStatus,
				Villages: results.Villages,
				HouseTypes: results.Lookups.lookups.LHouseTypes,
				Monitoring: results.Monitoring,
				Level1Status: Level1Status,
				Level2Status: Level2Status,
				Level3Status: Level3Status,
				Level4Status: Level4Status,
				Progress: progress,
				lang: req.session.lang,
				UserType: req.user.UserTypeID,
				User: req.user,
			});

		});
	}

});



/* GET all beneficiaires */
router.get('/get', isAuthenticated, function (req, res) {
	db.query('SELECT Beneficiary.*, concat(Beneficiary.FirstName, " ", Beneficiary.LastName) as BeneficiaryName, \
		LDistricts.DistrictName as District, \
    LTehsils.TehsilName as Tehsil, LUCs.UCName as UC, Villages.VillageName as Village, \
	CONCAT("Level-",COALESCE(MM.Level,0)) MonitoringLevel, \
	payments.FirstPaymentDate FirstPaymentDate,  payments.SecondPaymentDate SecondPaymentDate, payments.ThirdPaymentDate ThirdPaymentDate, payments.FourthPaymentDate FourthPaymentDate, 	payments.FirstPayment FirstPayment,  payments.SecondPayment SecondPayment, payments.ThirdPayment ThirdPayment, payments.FourthPayment FourthPayment, \
	if( isnull(payments.FirstPayment) and isnull(payments.SecondPayment) and isnull(payments.ThirdPayment) and isnull(payments.FourthPayment), "Unpaid","") Paid  \
    FROM Beneficiary \
	LEFT JOIN (select CNIC, LevelStatus, Max(MonitoringLevel) Level from Monitoring m group by CNIC, LevelStatus having LevelStatus =2 ) as MM on Beneficiary.CNIC = MM.CNIC  \
    LEFT JOIN LDistricts on Beneficiary.DistrictID = LDistricts.DistrictID \
    LEFT JOIN LTehsils on Beneficiary.TehsilID = LTehsils.TehsilID \
    LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
    LEFT JOIN Villages on Beneficiary.VillageID = Villages.VillageID \
	LEFT JOIN (select CNIC, max(if(InstallmentType=1, CreateDate, null)) FirstPaymentDate, max(if(InstallmentType=2, CreateDate, null)) SecondPaymentDate , max(if(InstallmentType=3, CreateDate, null)) ThirdPaymentDate , max(if(InstallmentType=4, CreateDate, null)) FourthPaymentDate,  max(if(InstallmentType=1, "1st Payment", null)) FirstPayment,  max(if(InstallmentType=2, "2nd Payment", null)) SecondPayment,  max(if(InstallmentType=3, "3rd Payment", null)) ThirdPayment,  max(if(InstallmentType=4, "4th Payment", null)) FourthPayment   from DistributedCheques dc group by cnic) as payments on Beneficiary.CNIC = payments.CNIC \
	 where BenStatusID=4 ', null, function (err, result) {
			res.json(result);
		});
});

/* GET all beneficiaires */
router.get('/getimages', isAuthenticated, function (req, res) {
	db.query('select CNIC,  MonitoringLevel, FrontImage, SideImage, OtherImage from Monitoring m where Month(CreateDate)>5 and Year(CreateDate)=2024', null, function (err, result) {
			res.json(result);
		});
});
/* GET verfied beneficiaires */
router.get('/getVerified', isAuthenticated, function (req, res) {
	db.query('SELECT Beneficiary.*, concat(Beneficiary.FirstName, " ", Beneficiary.LastName) as BeneficiaryName, \
		LDistricts.DistrictName as District, \
    LTehsils.TehsilName as Tehsil, LUCs.UCName as UC, Villages.VillageName as Village, \
    LBenStatus.BenStatusDesc as BeneficiaryStatus, Users.UserName as Enumerator \
    FROM Beneficiary \
    LEFT JOIN LDistricts on Beneficiary.DistrictID = LDistricts.DistrictID \
    LEFT JOIN LTehsils on Beneficiary.TehsilID = LTehsils.TehsilID \
    LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
    LEFT JOIN Villages on Beneficiary.VillageID = Villages.VillageID \
    LEFT JOIN LBenStatus on Beneficiary.BenStatusID = LBenStatus.BenStatusID \
		LEFT JOIN Users on Beneficiary.UpdatedBy = Users.UserID \
		WHERE Beneficiary.BenStatusID = 3 \
		ORDER BY LUCs.UCName ASC, Beneficiary.FirstName ASC, Beneficiary.LastName ASC, \
		Beneficiary.FatherName ASC', null, function (err, result) {
			res.json(result);
		});
});

/* GET all beneficiaires for name update form */
router.get('/getBeneficiairyNameForm', isAuthenticated, function (req, res) {
	db.query('SELECT Beneficiary.*, concat(Beneficiary.FirstName, " ", Beneficiary.LastName) as BeneficiaryName, \
		LDistricts.DistrictName as District, \
    LTehsils.TehsilName as Tehsil, LUCs.UCName as UC, Villages.VillageName as Village, \
    LBenStatus.BenStatusDesc as BeneficiaryStatus, Users.UserName as Enumerator \
    FROM Beneficiary \
    LEFT JOIN LDistricts on Beneficiary.DistrictID = LDistricts.DistrictID \
    LEFT JOIN LTehsils on Beneficiary.TehsilID = LTehsils.TehsilID \
    LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
    LEFT JOIN Villages on Beneficiary.VillageID = Villages.VillageID \
    LEFT JOIN LBenStatus on Beneficiary.BenStatusID = LBenStatus.BenStatusID \
		LEFT JOIN Users on Beneficiary.UpdatedBy = Users.UserID \
		WHERE Beneficiary.BenStatusID = 3 \
		ORDER BY Beneficiary.CNIC ASC', null, function (err, result) {
			res.json(result);
		});
});

/* GET all beneficiaires who have achieved level 1 */
router.get('/getBeneficiairyLevel1Achieved', isAuthenticated, function (req, res) {
	db.query('SELECT Beneficiary.*, concat(Beneficiary.FirstName, " ", Beneficiary.LastName) as BeneficiaryName, \
		LDistricts.DistrictName as District, \
    LTehsils.TehsilName as Tehsil, LUCs.UCName as UC, Villages.VillageName as Village, \
    LBenStatus.BenStatusDesc as BeneficiaryStatus, Users.UserName as Enumerator \
    FROM Beneficiary \
    LEFT JOIN LDistricts on Beneficiary.DistrictID = LDistricts.DistrictID \
    LEFT JOIN LTehsils on Beneficiary.TehsilID = LTehsils.TehsilID \
    LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
    LEFT JOIN Villages on Beneficiary.VillageID = Villages.VillageID \
	LEFT JOIN LBenStatus on Beneficiary.BenStatusID = LBenStatus.BenStatusID \
	LEFT JOIN Monitoring on Beneficiary.CNIC = Monitoring.CNIC \
		LEFT JOIN Users on Beneficiary.UpdatedBy = Users.UserID \
		WHERE  Monitoring.MonitoringLevel = 1 AND Monitoring.LevelStatus = 2 \
		ORDER BY Beneficiary.FirstName ASC', null, function (err, result) {
			res.json(result);
		});
});

router.get('/getHouseImages', isAuthenticated, function (req, res) {
	let HouseImages = {};
	req.CNIC = req.query.CNIC;
	mdlHouseImages.getOnePhaseI(req, function (err, result) {
		if (err) {
			console.log(err.message);
		}
		//console.log(result[0]);
		if (result.length > 0) {
			if (result[0].FrontImage) {
				// HouseImages.HouseFrontImagePhaseI = result[0].FrontImage.toString('base64');
				// if (result[0].FrontImage.length > 35000){
				// 	HouseImages.HouseFrontImagePhaseI = result[0].FrontImage.toString();
				// } else {
				// 	HouseImages.HouseFrontImagePhaseI = result[0].FrontImage.toString('base64');
				// }
				HouseImages.HouseFrontImagePhaseI = result[0].FrontImage.toString('base64');

				imageThumbnail(HouseImages.HouseFrontImagePhaseI, ThumbnailOptions)
					.then(thumbnail => {
						HouseImages.HouseFrontImagePhaseIThumb = thumbnail;
						if (result[0].SideImage) {
							HouseImages.HouseSideImagePhaseI = result[0].SideImage.toString('base64');
							imageThumbnail(HouseImages.HouseSideImagePhaseI, ThumbnailOptions)
								.then(thumbnail => {
									HouseImages.HouseSideImagePhaseIThumb = thumbnail;
									res.json(HouseImages);
								})
								.catch(err => console.error(err.message));
						}
					})
					.catch(err => console.error(err.message));
			}
		} else {
			res.json(HouseImages);
		}

	});
});

router.get('/getCNICImages', isAuthenticated, function (req, res) {
	let CNICImages = {};
	req.CNIC = req.query.CNIC;
	mdlCNICImages.getOne(req, function (err, result) {
		if (err) {
			console.log(err.message);
		}
		//console.log(result[0]);
		if (result.length > 0) {
			if (result[0].CNICFront) {

				// if (result[0].CNICFront.length > 35000){
				// 	CNICImages.CNICFront = result[0].CNICFront.toString();
				// 	console.log(typeof(CNICImages.CNICFront));
				// } else {
				// 	CNICImages.CNICFront = result[0].CNICFront.toString('base64');
				// 	console.log(typeof(CNICImages.CNICFront));
				// }
				CNICImages.CNICFront = result[0].CNICFront.toString('base64');
				imageThumbnail(CNICImages.CNICFront, ThumbnailOptions)
					.then(thumbnail => {
						CNICImages.CNICFrontThumb = thumbnail;
						if (result[0].CNICBack) {
							CNICImages.CNICBack = result[0].CNICBack.toString('base64');
							imageThumbnail(CNICImages.CNICBack, ThumbnailOptions)
								.then(thumbnail => {
									CNICImages.CNICBackThumb = thumbnail;
									res.json(CNICImages);
								})
								.catch(err => console.error(err.message));
						}
					})
					.catch(err => console.error(err.message));
			}

		} else {
			res.json(CNICImages);
		}
	});
});

router.get('/getListForCNICs', isAuthenticated, function (req, res) {
	db.query('SELECT Beneficiary.CNIC, concat(Beneficiary.FirstName, " ", Beneficiary.LastName) as BeneficiaryName, \
		LDistricts.DistrictName as District, \
    LTehsils.TehsilName as Tehsil, LUCs.UCName as UC, Villages.VillageName as Village, \
   	Users.UserName as Enumerator \
    FROM Beneficiary \
    LEFT JOIN LDistricts on Beneficiary.DistrictID = LDistricts.DistrictID \
    LEFT JOIN LTehsils on Beneficiary.TehsilID = LTehsils.TehsilID \
    LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
    LEFT JOIN Villages on Beneficiary.VillageID = Villages.VillageID \
		LEFT JOIN Users on Beneficiary.UpdatedBy = Users.UserID \
		WHERE Beneficiary.BenStatusID = 3 \
		ORDER BY Beneficiary.CNIC ASC', null, function (err, result) {
			if (err) {
				console.log(err.message);
			}
			res.json(result);
		});
});

router.get('/getCNICpics', isAuthenticated, function (req, res) {
	db.query('SELECT CNICFront, CNICBack \
		FROM CNICImages \
		WHERE CNIC =  ?', req.query.CNIC, function (err, result) {
			if (err) {
				console.log(err.message);
			}

			if (result[0].CNICFront) {
				result[0].CNICFront = result[0].CNICFront.toString('base64');
			}
			if (result[0].CNICBack) {
				result[0].CNICBack = result[0].CNICBack.toString('base64');
			}

			res.json(result);
		});
});

router.get('/getBenList', isAuthenticated, function (req, res) {
	db.query('SELECT Beneficiary.CNIC, Beneficiary.VHLatitude as Latitude, Beneficiary.VHLongitude as Longitude, \
		concat(Beneficiary.FirstName, " ", Beneficiary.LastName) as Name, \
		FaceImages.FaceImage as Photo, \
		LDistricts.DistrictName as District, \
    LTehsils.TehsilName as Tehsil, LUCs.UCName as UC, Villages.VillageName as Village, \
    LBenStatus.BenStatusDesc as BeneficiaryStatus, concat(Users.FirstName, " ", Users.LastName) as Enumerator \
    FROM Beneficiary \
    LEFT JOIN LDistricts on Beneficiary.DistrictID = LDistricts.DistrictID \
    LEFT JOIN LTehsils on Beneficiary.TehsilID = LTehsils.TehsilID \
    LEFT JOIN LUCs on Beneficiary.UCID = LUCs.UCID \
    LEFT JOIN Villages on Beneficiary.VillageID = Villages.VillageID \
    LEFT JOIN LBenStatus on Beneficiary.BenStatusID = LBenStatus.BenStatusID \
		LEFT JOIN Users on Beneficiary.UpdatedBy = Users.UserID \
		RIGHT JOIN FaceImages on Beneficiary.CNIC = FaceImages.CNIC LIMIT 500', null, function (err, result) {
			//result[0].Photo = result[0].Photo.toString();
			var results = [];
			async.eachSeries(result, function (row, callback) {
				// console.log(row.CNIC);
				// row.Photo = resizeImage.resize(image, 200, 300, resizeImage.JPEG);
				if (row.Photo.length > 350437) {
					row.Photo = row.Photo.toString();
				} else {
					row.Photo = row.Photo.toString('base64');
				}
				results.push(row);
				return callback();
			}, function () {
				//when all item.somethingElse is done, call the upper callback
				//console.log(results[0]);
				res.json(results);
			});
		});
});

router.get('/getBeneficiaryByCNIC', isAuthenticated, function (req, res) {
	db.query('SELECT * FROM  Beneficiary where CNIC = ?', [req.query.CNIC], function (err, result) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(result[0]);
		}
	});
});

router.get('/getBeneficiaryPhotoByCNIC', isAuthenticated, function (req, res) {
	console.log(req.query.CNIC);
	db.query('SELECT FaceImage FROM FaceImages where CNIC = ?', [req.query.CNIC], function (err, result) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			if (result[0]) {
				res.send("data:image/jpeg;base64, " + result[0].FaceImage.toString('base64'));
			} else {
				res.send("http://maps.google.com/mapfiles/kml/paddle/red-circle.png");
			}
		}
	});
});

router.get('/getBeneficiaryByUC', isAuthenticated, function (req, res) {
	async.series({
		Beneficiary: function (callback) {
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
			BenStatusID = 4 AND Beneficiary.UCID = ? \
		GROUP BY \
			Beneficiary.CNIC, m3.MonitoringLevel, m3.LevelStatus', [req.query.UCID], callback)
		},
		ModelHouses: function (callback) {
			db.query('SELECT ModelHouses.*, LUCs.UCName \
						FROM  ModelHouses \
						LEFT JOIN LUCs on ModelHouses.UCID = LUCs.UCID \
						where ModelHouses.UCID = ?  ', [req.query.UCID], callback)
		},
		CountLevel1InProgress: function (callback) {
			db.query('SELECT count(DistributedCheques.CNIC) as count from DistributedCheques \
			LEFT JOIN Beneficiary on DistributedCheques.CNIC = Beneficiary.CNIC \
			where InstallmentType = 1 AND Beneficiary.UCID = ?', req.query.UCID, callback)
		},
		CountLevel2InProgress: function (callback) {
			db.query('SELECT count(CNIC) as count from DistributedCheques where InstallmentType = 2', null, callback)
		},
		CountLevel3InProgress: function (callback) {
			db.query('SELECT count(CNIC) as count from DistributedCheques where InstallmentType = 3', null, callback)
		},
		CountLevel4InProgress: function (callback) {
			db.query('SELECT count(CNIC) as count from DistributedCheques where InstallmentType = 4', null, callback)
		},
		CountLevel1Achieved: function (callback) {
			db.query('SELECT count(Monitoring.CNIC) as count from Monitoring \
			LEFT JOIN Beneficiary on Monitoring.CNIC = Beneficiary.CNIC \
			where MonitoringLevel = 1 AND LevelStatus = 2 AND Beneficiary.UCID = ?', req.query.UCID, callback)
		}
	}, function (err, results) {
		if (err) {
			console.log(err.message);
			res.status(500).send(err.message);
		} else {
			console.log(results.CountLevel1InProgress);
			res.json(results);
		}
	});

});

router.get('/getBeneficiaryByVillage', isAuthenticated, function (req, res) {
	db.query('SELECT CNIC, FirstName, LastName, VHLatitude, VHLongitude \
						FROM  Beneficiary where VillageID = ? AND BenStatusID = 4 AND VHLatitude != 0', [req.query.VillageID], function (err, result) {
			if (err) {
				console.log(err.message);
				res.status(500).send(err.message);
			} else {
				res.json(result);
			}
		});
});

router.get('/getVillagesByUC', isAuthenticated, function (req, res) {
	db.query('SELECT VillageID as id, VillageName as text \
						FROM  Villages where UCID = ? ', [req.query.UCID], function (err, result) {
			if (err) {
				console.log(err.message);
				res.status(500).send(err.message);
			} else {
				res.json(result);
			}
		});
});

router.get('/getModelHouses', isAuthenticated, function (req, res) {
	db.query('SELECT ID, UCName, m.MHName, m.Latitude, m.Longitude, \
				VillageName, m.Status, m.Progress FROM ModelHouses as m \
				LEFT JOIN LUCs on m.UCID = LUCs.UCID \
				LEFT JOIN Villages on m.VillageID = Villages.VillageID \
				ORDER BY UCName, VillageName', [null], function (err, result) {
			if (err) {
				console.log(err.message);
				res.status(500).send(err.message);
			} else {
				res.status(200).send(result);
			}
		});
});

router.post('/updateAddress', function (req, res, next) {
	db.query("update Beneficiary \
	set DistrictID = ?, TehsilID=?, UCID = ?, VillageID = ?, UpdateDate =?, UpdatedBy = ? \
	WHERE CNIC = ?",
		[req.body.DistrictID, req.body.TehsilID, req.body.UCID, req.body.VillageID, new Date(), req.user.UserID, req.body.CNIC],
		function (err, result) {
			if (err) {
				console.log(err.message);
				res.status(500).send(err.message);
			} else {
				res.status(200).send(result);
			}
		});

});

router.post('/updateName', function (req, res, next) {

	db.query("update Beneficiary \
	set FirstName=?, LastName=?, FatherName = ?, UpdateDate =?, UpdatedBy = ? \
	WHERE CNIC = ?",
		[req.body.FirstName, req.body.LastName, req.body.FatherName, new Date(), req.user.UserID, req.body.CNIC],
		function (err, result) {
			if (err) {
				console.log(err.message);
				res.status(500).send(err.message);
			} else {
				res.status(200).send(result);
			}
		});

});

router.post('/updateDetail', function (req, res, next) {
	console.log(req.body);
	db.query("update Beneficiary \
	set FirstName=?, LastName=?, FatherName = ?, Gender = ? \
	WHERE CNIC = ?",
		[req.body.FirstName, req.body.LastName, req.body.FatherName, req.body.Gender, req.body.CNIC],
		function (err, result) {
			if (err) {
				console.log(err.message);
				res.status(500).send(err.message);
			} else {
				console.log(result);
				res.status(200).send(result);
			}
		});

});

router.post('/post', function (req, res, next) {
	console.log(req.body);
	//req.body.UserID = uuidv1();
	req.body.CreateDate = new Date();
	req.body.CreatedBy = req.user.UserID;
	db.query("insert into Beneficiary set ?", [req.body], function (result, err) {
		if (err) {
			console.log(err.message);
			res.send(err.message);
		} else {
			res.send(result);
		}
	});
});

router.post('/updateCNICFront', function (req, res, next) {
	console.log(req.body.CNIC);
	var CNICFront = req.body.CNICFront.toString('base64');
	CNICFront = CNICFront.slice(23);
	CNICFront = Buffer.from(CNICFront, "base64");

	db.query("UPDATE CNICImages set CNICFront = ?, UpdateDate = ? WHERE CNIC = ?",
		[CNICFront, new Date(), req.body.CNIC], function (result, err) {
			if (err) {
				console.log(err.message);
				res.send(err.message);
			} else {
				console.log(result);
				res.send(result);
			}
		});
	//res.send();
});
router.post('/updateCNICBack', function (req, res, next) {
	var CNICBack = req.body.CNICBack.toString('base64');
	CNICBack = CNICBack.slice(23);
	CNICBack = Buffer.from(CNICBack, "base64");
	console.log(req.body.CNIC);
	db.query("UPDATE CNICImages set CNICBack = ?, UpdateDate = ? WHERE CNIC = ?",
		[CNICBack, new Date(), req.body.CNIC], function (result, err) {
			if (err) {
				console.log(err.message);
				res.send(err.message);
			} else {
				console.log(result);
				res.send(result);
			}
		});
});

router.put('/put', isAuthenticated, function (req, res, next) {
	db.query('UPDATE Beneficiary SET UserName = ?, UserPassword=?, FirstName = ?, \
		LastName=?, Email=?, Phone=?, UserTypeID=?, UpdateDate=?, UpdatedBy=? WHERE UserID=?',
		[req.body.UserName, req.body.UserPassword, req.body.FirstName, req.body.LastName,
		req.body.Email, req.body.Phone, req.body.UserTypeID, new Date(), req.user.UserID, req.body.UserID], function (result, err) {
			if (err) {
				console.log(err.message);
			} else {
				res.send(result);
			}
		});
});

router.delete('/delete', isAuthenticated, function (req, res, next) {
	db.query('DELETE FROM Beneficiary WHERE CNIC=?', [req.query.CNIC], function (result, err) {
		console.log(result);
		res.send(result);
	});

});

module.exports = router;
