var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* Get the home page*/
router.get('/', ensureAuthentication, function(req, res, next) {
    console.log("Welcome to your homepage!");
    console.log(req.user);
    var moto,num_of_issues,num_of_applause;
    res.render('home', {
      title: 'Home',
      name: req.user.name,
      moto: req.user.moto,
      num_of_issues: req.user.issues,
      supporters: req.user.supporters,
      num_of_applause: req.user.applauses
    });
});

/* Get the prfile page */
router.get('/profile/:username', ensureAuthentication, function(req, res, next) {
    //console.log(req);
    var username = req.params.username,organisationArray;
    User.getUserByUsername(username, function(err, user){
      if (err) throw error;
      organisationArray = user.orgs;
    })
    res.render('profile', { title: username, organisations: organisationArray});
});


function ensureAuthentication(req, res, next){
    if(req.isAuthenticated())
      return next();
    res.redirect('/users/login');
}

module.exports = router;
