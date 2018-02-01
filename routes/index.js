var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
var Issue = require('../models/issue');
var Org = require('../models/org');
var shortId = require('short-mongo-id');

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
            Org.adminOrgs(req.user.username, function(err3, res3){
              if(err3) throw err3;
              else{

                res.render('issues',{
                  title: 'Home',
                  orgs: res3,
                  userDetails: res2,
                  issues: results
                })    
              }
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
      var department = req.body.issueDept;
      var topic = req.body.issueDescriptionTopic;
      var desc = req.body.issueDescriptionText;
      var anonymity;

      if(req.body.anonymity)
        anonymity =  "on";
      else
        anonymity = "off";

      var issue = new Issue({
        username: req.user.username,
        department: department,
        status: "open",
        name: req.user.name,
        issueTopic: topic,
        issueDesc: desc,
        anonymity: anonymity,
      });

      Issue.createIssue(issue, function(err, result){
        if(err)
          throw err;
          //console.log("Error Occured while uploading the post to the database");
        else{
          console.log('Issue Posted..');
        }
      });
    }
    res.redirect('/');
});


router.get('/orgs/:orgname', ensureAuthentication, function(req, res, next) {
    console.log("Fetchgin the organisation details");
    var orgname = req.params.orgname;
    Org.findOrg(orgname, function(err2, res2){
      if(err) throw err;
      else{
        res.render('joinorg', {
          title: 'Groups',
          orgs: res
        });
      }
    });
});

router.post('/addmyorg', ensureAuthentication, function(req, res, next) {
    console.log("Initiating to add the organisation");
    var name = req.body.orgName;
    var aboutUs = req.body.orgAbout;
    var alert = req.body.orgAlert;
    

    var orgDtl = new Org({
      name:name,
      alert:alert,
      aboutUs: aboutUs,
      admin: [req.user.username]
    });
    orgDtl.userId = shortId(orgDtl._id.toString()),
      
    console.log(orgDtl);

    Org.makeOrg(orgDtl, function(err1, res1){
      if(err1) {
        Org.adminOrgs(req.user.username, function(err2, res2){
          if(err2) throw err2;
          else{
            res.render('myorg', {
              title: 'My Organisations',
              orgs: res2,
              errorDup: err1
            });
          }
        });
      }
      else{
        console.log(res1);
        res.redirect('/myorg');
      }
    });
});

router.get('/myorg', ensureAuthentication, function(req, res, next) {
    console.log("loading organisation add page");
    Org.adminOrgs(req.user.username, function(err2, res2){
      if(err2) throw err2;
      else{
        res.render('myorg',{
          title: 'My Organisations',
          orgs: res2
        })    
      }
    });
});

router.post('/delorg/:orgId', ensureAuthentication, function(req, res, next) {
    console.log("Initiating Deletion of Organisation");
    var orgId = req.params.orgId;
    console.log(orgId);
    Org.deleteOrg(orgId, req.user.username, function(err2, res2){
    if(err2) throw err2;
        else{
            console.log(res2);
            res.redirect('/myorg');
          }   
    });
});



function ensureAuthentication(req, res, next){
    if(req.isAuthenticated())
      return next();
    res.redirect('/users/login');
}


module.exports = router;
