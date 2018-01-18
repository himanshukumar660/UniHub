var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET all the tweets and all page. */
router.get('/', ensureAuthentication, function(req, res, next) {
    console.log("Himanshu Kumar");
    res.render('index', { title: 'Home' });
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
