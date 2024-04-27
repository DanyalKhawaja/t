var db = require('../config/connection');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
		usernameField : 'UserName',
	  passwordField : 'UserPassword',
	  passReqToCallback : true
	},
	function(req, username, password, done) {

		db.query("SELECT * FROM Users WHERE UserName = ?", username, function(err,rows){

			if (err){
				console.log(err.message);
				return done(err);
			}
			if (!rows.length) {
				console.log("No User Found");
      	return done(null, false, req.flash('message', 'Username not found.'));
				// req.flash is the way to set flashdata using connect-flash
      }
			// if the user is found but the password is wrong
      if (!( rows[0].UserPassword == password)) {
				console.log("Oops! Wrong password.");
        return done(null, false, req.flash('message', 'Oops! Wrong password.'));
				// create the loginMessage and save it to session as flashdata
			}
      // all is well, return successful user
			console.log("all is well");
		
      return done(null, rows[0]);
		});

	}));

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
				console.log('serializing user: ');
				db.query('insert into UsersLog set UserID = ?, Activity = ?, CreateDate = ?', 
					[user.UserID, "Logged In", new Date()], function(err, rows){
						if (err) {
							console.log(err.message);
						}
					});
        done(null, user.UserID);
    });

    passport.deserializeUser(function(id, done) {
			db.query("SELECT * FROM Users WHERE UserID = ?", id, function(err, rows){
				done(err, rows[0]);
    	});
		});


};
