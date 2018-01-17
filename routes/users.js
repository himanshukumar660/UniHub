var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	req.flash('info', 'Welcome');
	res.render('register', {
		name: "",
		email: "",
		username: "",
		password: "",
		cnfpassword: "",
		title: 'Register'
	});
});

router.post('/register', function(req, res, next) {
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var cnfpassword = req.body.cnfpassword;
	// // Check for Image Field
	// if(req.files.profileimage){
	//     console.log('uploading File...');
	//
	//     // File Info
	//     var profileImageOriginalName = req.files.profileimage.originalname;
	//     var profileImageName = req.files.profileimage.name;
	//
	//     var profileImageMime = req.files.profileimage.mimetype;
	//     var profileImagePath = req.files.profileimage.path;
	//     var profileImageExt = req.files.profileimage.extension;
	//     var profileImageSize = req.files.profileimage.size;
	// } else {
	//     // Set a Default Image
	//     var profileImageName = 'noimage.png';
	// }

	// Form Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Enter valid email').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password of min 5 characters required ').isLength({
		min: 5
	});
	req.checkBody('cnfpassword', "Password doesn't match").equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();
	console.log(errors);
	if (errors) {
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			cnfpassword: cnfpassword,
			title: "Register"
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
		});
		// Create User
		User.createUser(newUser, function(err) {
			if (err) {
				var errorUnique = [];
				for (var ech in err.errors) {
					errorUnique.push(ech)
				};
				existsorNotEmail = (errorUnique.indexOf("email") == -1) ? email : "",
					existsorNotUsername = (errorUnique.indexOf("username") == -1) ? username : "",

					console.log(errorUnique);
				res.render('register', {
					validatorError: errorUnique,
					name: name,
					email: existsorNotEmail,
					username: existsorNotUsername,
					password: password,
					cnfpassword: cnfpassword,
					title: "validationErrors",
				});
			} else {
				req.flash('Account Created Successfully');
				res.redirect('/users/login');
			}
		});
	}
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		title: 'Login'
	});
});


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

//.>>>>>>>>>>>>>>>>>>>>>>To CHECK<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//
passport.use(new LocalStrategy(
    function(username, password, done){
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                console.log('Unknown User');
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));
//.>>>>>>>>>>>>>>>>>>>>>>To CHECK<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//

router.post('/login', passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function(req, res) {
	console.log('Authentication Successful');
	req.flash('Authentication Successful');
	res.redirect('/');
	console.log("Welcome! You are Logged in");
});

//complete the logout functionality
router.get('/logout', function(req, res, next) {
	req.logout();
	console.log('You have logged out');
	req.flash('You have logged out');
	res.redirect('/users/login');
});

module.exports = router;
