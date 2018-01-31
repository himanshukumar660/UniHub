var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
var Issue = require('../models/issue');

/* Get the home page*/
router.get('/', ensureAuthentication, function(req, res, next) {
  console.log("Welcome to your homepage!");
  console.log(req.user);

  Issue.getIssuesLatest(function(err, results){
    if(err)
      console.log("Could'nt fetch the issues");
    else
    {
      User.getUserByUsername(req.user.username, function(req2,res2){
        if(err) throw err;
        else
        {
          res.render('home', {
            title: 'Home',
            userDetails: res2,
            issues: results
          });
        }
      });

    }
  });    
});

//Asynchronously get the Issues and populate the issue division
router.get('/getIssues/:date', ensureAuthentication, function(req,res, next){
  console.log("Fteching More Issues");
  var date = req.params.date;
  console.log(date);
  Issue.getIssuesByDate(date, function(err, results){
    if(err)
      console.log("Could'nt fetch the issues");
    else
    {
      console.log(results);
      res.send(results);
    }
  })
});


//When the user Likes any post
router.post('/likepost/:id', ensureAuthentication, function(req,res, next){
  console.log("Initiating to like the post");
  var _id = req.params.id;
  console.log(_id);
  console.log("Himanshu Kumar");
  var username = req.user.username;
  Issue.chkUserLikedPost(username, _id, function(err1, results1){
    if(err1) throw err1
      else
      {
         if(results1==null) //Not have liked before
         {
          Issue.addUsertoSupporters(username, _id, function(err2){
            if(err2) throw err2;
            else
            {
              Issue.incLikesByIssues(username, _id, function(err3){
                if(err3)
                  throw err3;
              });
            }
          });
        }
        else {
          Issue.removeUsertoSupporters(username, _id, function(err2){
            if(err2) throw err2;
            else
            {
              Issue.dcrLikesByIssues(req.user.username, _id, function(err3){
                if(err3)
                  throw err3;
              });
            }
          });
        } 
      }
    });
});


//When the user demands for a single post details
router.get('/search_org/:orgname', ensureAuthentication, function(req,res, next){
  console.log("Fteching the organisations details");
  var id = req.params.orgname;
  console.log(id);
  
  Issue.getorgnames(id, function(err, result){
    if(err)
      console.log("Could'nt fetch names of organisations");
    else
    {
      console.log(result);
      res.render('indPost', {
        title: 'Post',
        details: result
      });
    }
  })
});


//When the user demands for a single post details
router.get('/indpost/:id', ensureAuthentication, function(req,res, next){
  console.log("Fteching the post details");
  var id = req.params.id;
  console.log(id);
  
  Issue.getIssueById(id, function(err, result){
    if(err)
      console.log("Could'nt fetch post details");
    else
    {
      console.log(result);
      res.render('indPost', {
        title: 'Post',
        details: result
      });
    }
  })
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
        User.getUserByUsername(req.user.username, function(req2,res2){
          if(err) throw err;
          else
          {
            res.render('home', {
              title: 'Home',
              userDetails: res2,
              issues: results
            });
          }
        });
      }
    });
  });

router.get('/profile/:username', ensureAuthentication, function(req, res, next) {
  console.log("Fetchgin the profile details");
  var username = req.params.username || req.user.username;
  console.log(username);
  User.getUserByUsername(username, function(err, resultsUser){
    if(err) throw err;
    else{
      Issue.getIssueByUsername(username, function(err, resultsIssue){
        if(err) throw err;
        else{
          res.render('profile', {
            title: 'Profile',
            profile: resultsUser,
            issues: resultsIssue
          });
        }
      });
    }
  });    
});


//Post the issue
router.post('/post', ensureAuthentication, function(req, res, next) {
  if(req.body){     
    var dept = req.body.issueDept;
    var topic = req.body.issueDescriptionTopic;
    var desc = req.body.issueDescriptionText;
    var anonymity;
    var status= "open";
    var username= req.user.username;

    if(req.body.anonymity)
      anonymity =  "on";
    else
      anonymity = "off";

    var issue = new Issue({
      username: username,
      anonymity: anonymity
    });


    var issueDetails = Object({
      department: dept,
      issueTopic: topic,
      issueDesc: desc,
      datePosted: new Date(),
      status: status
    });

    Issue.chkUser(username, function(err1, res1){
      if(err1) throw err1;
      else if(res1==null)
      {
          Issue.addRaiser(issue, function(err2, res2){
            if(err2)
              throw err2;
            else
            {
              Issue.addIssueDetails(username, issueDetails, function(err3, res3){
                if(err3) throw err3;
                else {
                  console.log("here is your data");
                  console.log(res3);
                }
              });
            }
          });
      }
      else
      {
          Issue.addIssueDetails(username, issueDetails, function(err3, res3){
          if(err3) throw err3;
          else {
            console.log("here is your data");
            console.log(res3);
          }
        });
      }
    });
  }
  res.redirect('/');
});


function ensureAuthentication(req, res, next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/users/login');
}


module.exports = router;
