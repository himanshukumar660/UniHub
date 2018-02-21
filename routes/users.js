var express = require('express');
var crypto = require('crypto');
var url = require('url');
var mime = require('mime');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Issue = require('../models/issue');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});

var upload = multer({ storage: storage });

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


/* GET users listing. */
router.get('/',function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register' ,ensureNotAuthenticated, function(req, res, next) {
	//if(typeof(req.session.passport)==='undefined')
		res.render('register', {
			name: "",
			email: "",
			username: "",
			password: "",
			cnfpassword: "",
			title: 'Register'
		});
	// else{
	// 	res.redirect('/');
	// 	console.log();
	// }
});

router.post('/check_creadentials/', ensureNotAuthenticated, function(req, res, next){
	var credential = req.body.credential;
	var type = req.body.type;

	User.getCredentialDetails(type, credential, function(err1, res1){
		if(err1) throw err1;
		else{
			if(credential == "")
				res.send('Empty');
			else if(res1==null)
				res.send('Not Found');
			else
				res.send('Found');
		}
	});
});

router.post('/register', upload.single('avatar'), function(req, res, next) {
//	console.log(req.body);
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var cnfpassword = req.body.cnfpassword;
	// Check for Image Field
	console.log(req.file);
	if(req.file){
	    var profileImageName = req.file.filename;
      console.log(profileImageName);
	}
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
			avatarPath: profileImageName
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
					title: "Register",
				});
			} else {
				req.flash('msg', 'Account Created Successfully');
				res.redirect('/users/login');
			}
		});
	}
});

router.get('/login', ensureNotAuthenticated, function(req, res, next) {
	//if(typeof(req.session.passport)==='undefined')
    //console.log(req.flash('msg'));
		var error,query;
		if(typeof(req.headers.referer)!='undefined')
		{
			query = url.parse(req.headers.referer, true);
			console.log(query.pathname);
			if(typeof(req.session.flash)!='undefined'&&query.pathname==='/users/login')
				{
					error = req.session.flash.error[0];
				}
			console.log(error);
		}
    var flashSuccessfulRegister = req.flash('msg');
    console.log(flashSuccessfulRegister);

		res.render('login', {
      flashSuccessfulRegister : flashSuccessfulRegister,
      title: 'Login',
			username: "",
			password: "",
			error: error
		});
	//else{
		//res.redirect('/');
	//}
});

router.post('/login', passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function(req, res) {
	console.log('Authentication Successful');
	req.flash('Authentication Successful');
	res.redirect('/');
	console.log("Welcome! You are Logged in");
});

//complete the logout functionality
router.get('/logout', function(req, res, next) {
	if (req.session) {
	    // delete session object
	    req.session.destroy(function(err) {
	      if(err) {
	        return next(err);
	      } else {
					console.log('Logged Out!');
	        return res.redirect('/users/login');
	      }
	    });
	  }
});

function ensureNotAuthenticated(req, res, next){
	if(!req.isAuthenticated())
		{
			console.log("User is NOT Authenticated!");
			return next();
		}
	else
	{
			console.log("Authenticated User!");
			res.redirect('/');
	}
}

module.exports = router;
