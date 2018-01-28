var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
var Issue = require('../models/issue');


/* Get the home page*/
router.get('/', ensureAuthentication, function(req, res, next) {
    console.log("Welcome to your homepage!");
    console.log(req.user);
    //issueList = new Object();

    Issue.getByDate(function(err, results){
      if(err)
        console.log("Could'nt fetch the issues");
      else
      {
        res.render('home', {
          title: 'Home',
          name: req.user.name,
          moto: req.user.moto,
          num_of_issues: req.user.issues,
          supporters: req.user.supporters,
          num_of_applause: req.user.applauses,
          avatar: req.user.avatarPath,
          issues: results
        });
      }
    });    
});

router.get('/trending', ensureAuthentication, function(req, res, next) {
    console.log("Welcome to trending page!");
    console.log(req.user);
    //issueList = new Object();

    Issue.getIssueByLikes(function(err, results){
      if(err)
        console.log("Could'nt fetch the issues");
      else
      {
        res.render('home', {
          title: 'Home',
          name: req.user.name,
          moto: req.user.moto,
          num_of_issues: req.user.issues,
          supporters: req.user.supporters,
          num_of_applause: req.user.applauses,
          avatar: req.user.avatarPath,
          issues: results
        });
      }
    });
});

router.get('/myprofile', ensureAuthentication, function(req, res, next) {
    console.log("Welcome to my profile page!");
    console.log(req.user);
    //issueList = new Object();

    Issue.getIssueByUsername(req.user.username, function(err, results){
      if(err)
        console.log("Could'nt fetch the issues");
      else
      {
        res.render('home', {
          title: 'Home',
          name: req.user.name,
          moto: req.user.moto,
          num_of_issues: req.user.issues,
          supporters: req.user.supporters,
          num_of_applause: req.user.applauses,
          avatar: req.user.avatarPath,
          issues: results
        });
      }
    });
});


//Post the issue
router.post('/post', ensureAuthentication, function(req, res, next) {
    console.log("Fucntion executed for posting the issue");
    console.log(req.body);
    res.redirect('/');
    if(req.body){
      var department = req.body.issueDept;
      var topic = req.body.issueDescriptionTopic;
      var desc = req.body.issueDescriptionText;
      var anonymity;
      if(req.body.anonymity)
        anonymity =  "on";
      else
        anonymity = "off";
      var post = new Issue({
        username: req.user.username,
        name: req.user.name,
        department: department,
        status: "open",
        issueTopic: topic,
        issueDesc: desc,
        anonymity: anonymity
      });
      // Add post to the database
      Issue.createIssue(post, function(err){
        if(err)
          console.log("Error Occured while uploading the post to the database");
      });
    }
    res.redirect('/');
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
