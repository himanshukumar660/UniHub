var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next){
  res.render('register', {
    name:"",
    email:"",
    username:"",
    password:"",
    cnfpassword:"",
    title : 'Register'});
});

router.get('/login', function(req, res, next){
  res.render('login', { title : 'Login'});
});


router.post('/register', function(req, res, next) {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var cnfpassword =  req.body.cnfpassword;


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

    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Enter valid email').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('cnfpassword',"Password doesn't match").equals(req.body.password);

    // Check for errors
    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            cnfpassword: cnfpassword,
            title: "Register"
        });
     }
     //else {
    //     var newUser = new User({
    //         name: name,
    //         email: email,
    //         username: username,
    //         password: password,
    //         profileImage: profileImageName
    //     });

            // // Create User
            // User.createUser(newUser, function(err, user){
            //     if(err)throw err;
            //     console.log(user);
            // });

            //Success Message
            // req.flash('success', 'You are now registered and may log in');
            //
            // res.location('/');
            // res.redirect('/');
});
//complete the logout functionality
router.get('/logout', function(req, res, next){
  res.redirect('/users/login');
});

module.exports = router;
