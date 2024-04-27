var LocalStrategy = require('passport-local').Strategy;

var db = require('../config/connection');
module.exports = function(passport){

	passport.use('login', new LocalStrategy({
		usernameField : 'UserName',
    passwordField : 'UserPassword',
    passReqToCallback : true
  },
  function(req, username, password, done) {

			db.query("SELECT * FROM Users WHERE UserName = ?", username, function(err,rows){
				if (err){
					console.log('Oops! Wrong password.');
					return done(err);
				}
				if (!rows.length) {
	            	return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
	            }
				// if the user is found but the password is wrong
	            if (!( rows[0].UserPassword == password))
	                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

	            // all is well, return successful user
	            return done(null, rows[0]);
			});

	}));

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}
