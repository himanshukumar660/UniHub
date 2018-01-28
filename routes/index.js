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

    console.log("Hi");
    //console.log(issueList);
    
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
        department: department,
        status: "open",
        issueTopic: topic,
        issueDesc: desc,
        anonymity: anonymity
      });
      // Add post to the database
      Issue.createIssue(post, function(err){
        if(err)
          console.log("Error Occured while uploading the post tp the database");
      });
    }
    res.redirect('/');

//     Fucntion executed for posting the issue
// { issueDept: 'Information Technology',
//   issueDescriptionTopic: 'In',
//   issueDescriptionText: 'ind',
//   identity: 'on',
//   issuePost: 'Post' }
    // res.render('home', {
    //   title: 'Home',
    //   name: req.user.name,
    //   moto: req.user.moto,
    //   num_of_issues: req.user.issues,
    //   supporters: req.user.supporters,
    //   num_of_applause: req.user.applauses,
    //   avatar: req.user.avatarPath
    // });
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
