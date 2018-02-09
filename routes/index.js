var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
var Issue = require('../models/issue');
var Org = require('../models/org');
var shortId = require('short-mongo-id');

//Following are related with the issues 

/* Get the home page*/
router.get('/', ensureAuthentication, function(req, res, next) {
  console.log("Welcome to your homepage!");
  console.log(req.user);
  var username = req.user.username;
  var userObj = {
    name: req.user.name,
    username : req.user.username
  };

  Issue.getIssuesLatest(function(err1, res1){
    if(err1)
      console.log("Could'nt fetch the issues");
    else
    {
      User.getUserByUsername(username, function(err2,res2){
        if(err2) throw err2;
        else
        {
          Org.memberOrgs(userObj, function(err4, res4){
           if(err4) throw err4;
           else{
            var userOrgs = [];

            for(each in res4){
              userOrgs.push(res4[each].userId);
            }
            console.log(userOrgs);

            res.render('issues',{
              title: 'Home',
              username: req.user.username,
              name: req.user.name,
              memberctrlorgs: res4,
              userDetails: res2,
              issues: res1,
              userOrgs: userOrgs,
            })
          }
        }) 
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

router.post('/delpost/:id', ensureAuthentication, function(req,res, next){
  console.log("Fteching the post details");
  var postId = req.params.id;
  console.log(postId);
  var username = req.user.username;
  console.log(username);
  
  Issue.delIssueById(postId, username, function(err, result){
    if(err) throw err
    else
    {
      console.log(result);
      res.send("1");
    }
  })
});

router.post('/openIssue/:id', ensureAuthentication, function(req,res, next){
  var postId = req.params.id;
  var username = req.user.username;
  
  Issue.openIssueById(postId, username, function(err, result){
    if(err) throw err
    else
    {
      console.log(result);
      res.send("1");
    }
  })
});

router.post('/closeIssue/:id', ensureAuthentication, function(req,res, next){
  console.log("Fteching the post details");
  var postId = req.params.id;
  console.log(postId);
  var username = req.user.username;
  console.log(username);
  
  Issue.closeIssueById(postId, username, function(err, result){
    if(err) throw err
    else
    {
      console.log(result);
      res.send("1");
    }
  })
});


//Trending Posts : Fetch the issues with maximum number of Likes
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

//Post the issue
//Status : Checked
router.post('/post', ensureAuthentication, function(req, res, next) {
  if(req.body){
    if(req.body.orguserId!="not_selected")
    {
      var orgId = req.body.orguserId;
      var topic = req.body.issueDescriptionTopic;
      var desc = req.body.issueDescriptionText;
      var name = req.user.name;

      var anonymity;

      if(req.body.anonymity)
        anonymity =  "on";
      else
        anonymity = "off";

      var issue = new Issue({
        username: req.user.username,
        orgUserId: orgId,
        name: name,
        status: "open",
        issueTopic: topic,
        issueDesc: desc,
        anonymity: anonymity,
      });

      Org.findOrgByUID(orgId, function(err1, res1){
        if(err1) throw err1;
        else{
          issue.orgname = res1.name;
          Issue.createIssue(issue, function(err2, res2){
            if(err2) throw err2;
                  //console.log("Error Occured while uploading the post to the database");
                  else{
                    console.log('Issue Posted..');
                  }
                });    
        }
      });

    }
    res.redirect('/');
  }
  else{
    res.redirect("/");
  }
});


//Following deals with the user profiles


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



//The following method shows official page of the organisation
router.get('/orgs/:orgUId', ensureAuthentication, function(req, res, next) {
  console.log("Fetchgin the organisation details");
  var orgUId = req.params.orgUId;
  var username = req.user.username;
  console.log(orgUId);
  Org.findOrgByUID(orgUId, function(err1, res1){
    if(err1) throw err1;
    else{
      console.log(res1);
      Issue.getOpenIssueByOrgUserId(orgUId, function(err2, res2){
        if(err2) throw err2;
        else{
          console.log(res2);
          Issue.getClosedIssueByOrgUserId(orgUId, function(err3, res3){
            if(err3) throw err3;
            else{
              console.log(res3);
              res.render('indorgissues', {
                title: res1.name+" : ",
                username: username,
                orgDtl : res1,
                openIssues: res2,
                closedIssues: res3  
              });
            }
          });
        }
      });
    }
  });    
});



// Following deals with the APIs for accessing the organisation modiules.


router.post('/joinOrg/:orgUId', ensureAuthentication, function(req, res, next) {
  console.log("Fetchgin the organisation details");
  var orgUId = req.params.orgUId;
  var username = req.user.username;
  console.log(orgUId);
  var userObj = {
    name: req.user.name,
    username : req.user.username  
  };
  Org.enterOrg(orgUId, userObj, function(err2, res2){
    if(err2) throw err2;
    else
    {
      console.log('Added to pending Queue!!');
      console.log('Waiting for the adminstrator for accepting the request');
      res.redirect('back');
    }
  })   
});

router.post('/addmyorg', ensureAuthentication, function(req, res, next) {
  console.log("Initiating to add the organisation");
  var name = req.body.orgName;
  var aboutUs = req.body.orgAbout;
  var alert = req.body.orgAlert;


  var userObj = {
    name: req.user.name,
    username : req.user.username  
  };

  var orgDtl = new Org({
    name:name,
    alert:alert,
    aboutUs: aboutUs,
    admin: [userObj],
    members: [userObj]
  });

  orgDtl.userId = shortId(orgDtl._id.toString());

  Org.makeOrg(orgDtl, function(err1, res1){
    if(err1) throw err1;
    else{
      console.log("Hi wkskskksksks\n 3");
      console.log(res1);
    }
  });
  console.log("Hi wkskskksksks\n 4");
  res.redirect('/myorg');
});

router.get('/pendingreq/:orguid', ensureAuthentication, function(req, res, next) {
  console.log("loading organisation add page");
  var orgUId = req.params.orguid;
  var username = req.user.username;
  console.log("Fetchgin the organisation pending requests");
  console.log(orgUId);

  Org.findOrgByUID(orgUId, function(err1, res1){
    if(err1) throw err1;
    else{
      console.log(res1);
      Issue.getOpenIssueByOrgUserId(orgUId, function(err2, res2){
        if(err2) throw err2;
        else{
          console.log(res2);
          Issue.getClosedIssueByOrgUserId(orgUId, function(err3, res3){
            if(err3) throw err3;
            else{
              res.render('indorgpendingreq',{
                title: res1.name+" : ",
                username: username,
                orgDtl : res1,
                openIssues: res2,
                closedIssues: res3,  
              });
            }
          });
        }
      });
    }
  });
});

router.get('/members/:orguid', ensureAuthentication, function(req, res, next) {
  console.log("loading organisation member list");
  var orgUId = req.params.orguid;
  var username = req.user.username;
  console.log("Fetchgin the organisation pending requests");
  console.log(orgUId);

  Org.findOrgByUID(orgUId, function(err1, res1){
    if(err1) throw err1;
    else{
      console.log(res1);
      Issue.getOpenIssueByOrgUserId(orgUId, function(err2, res2){
        if(err2) throw err2;
        else{
          console.log(res2);
          Issue.getClosedIssueByOrgUserId(orgUId, function(err3, res3){
            if(err3) throw err3;
            else{
              res.render('indorgmembers',{
                title: res1.name+" : ",
                username: username,
                orgDtl : res1,
                openIssues: res2,
                closedIssues: res3,  
              });
            }
          });
        }
      });
    }
  });
});


router.post('/acceptReq/', ensureAuthentication, function(req, res, next){
  console.log("came here");
  console.log(typeof(req.body));
  console.log(typeof(req.body.orgDtl));
  console.log(req.body.reqUserName);
  console.log(req.body.reqUserUsername);

  var reqUserUsername = toString(req.body.reqUserUsername);
  var reqUsername = toString(req.body.reqUserName);
  var orgUserId = req.body.orgDtl;

  
  var username = req.user.username;
  var name = req.user.name;

  console.log(username);
  console.log(name);
  console.log(orgUserId);
  console.log(reqUsername);
  console.log(reqUserUsername);

  var adminObj = {
    username: username,
    name: name
  };

  console.log(adminObj);

  var reqUserObj = {
    name: JSON.stringify(req.body.reqUserName).replace(/"/g,''),
    username: JSON.stringify(req.body.reqUserUsername).replace(/"/g,''),
  };
  console.log(reqUserObj);
  console.log("Hi am");

  console.log(orgUserId);
  console.log(reqUsername);
  console.log(reqUserUsername);
  console.log(adminObj);
  console.log(reqUserObj);

  Org.chkAdmin(orgUserId, adminObj, function(err1, res1){
    if(err1) throw err1;
    else{
      console.log("Going to enter next function");
      console.log(res1);
      if(res1.length==0){
        res.send('Not Enough rights to perform this operation');
        console.log("Not Enough rights to perform this operation");
      }
      else{
        console.log("Performing accepting");
        Org.acceptPendingReq(orgUserId, reqUserObj, function(err2, res2){
          if(err2) throw err2;
          else{
            console.log(res2);
            res.send('Member added to member Group');
            console.log("Member added to member Group");    
          }
        });
      }
      console.log("Admin Check Successfull");
    }
  });
});

router.post('/cancelPendingReq/:orgUserId', ensureAuthentication, function(req, res, next){
  var username = req.user.username;
  var name = req.user.name;
  var orgUserId = req.params.orgUserId;

  var userObj = {
    username: username,
    name: name
  };
  
  Org.declinePendingReq(orgUserId, userObj, function(err1, res1){
    if(err1) throw err1;
    else{
      console.log(res1);
      console.log("Your request is cancelled");
      res.send('Successfull');
    }
  });
});


router.post('/declineReq/', ensureAuthentication, function(req, res, next){
  console.log("came here");
  console.log(typeof(req.body));
  console.log(typeof(req.body.orgDtl));
  console.log(req.body.reqUserName);
  console.log(req.body.reqUserUsername);

  var reqUserUsername = toString(req.body.reqUserUsername);
  var reqUsername = toString(req.body.reqUserName);
  var orgUserId = req.body.orgDtl;

  
  var username = req.user.username;
  var name = req.user.name;

  console.log(username);
  console.log(name);
  console.log(orgUserId);
  console.log(reqUsername);
  console.log(reqUserUsername);

  var adminObj = {
    username: username,
    name: name
  };

  console.log(adminObj);

  
  var reqUserObj = {
    name: JSON.stringify(req.body.reqUserName).replace(/"/g,''),
    username: JSON.stringify(req.body.reqUserUsername).replace(/"/g,''),
  };

  console.log(reqUserObj);
  console.log("Hi am");

  console.log(orgUserId);
  console.log(reqUsername);
  console.log(reqUserUsername);
  console.log(adminObj);
  console.log(reqUserObj);

  Org.chkAdmin(orgUserId, adminObj, function(err1, res1){
    if(err1) throw err1;
    else{
      console.log("Going to enter next function");
      console.log(res1);
      if(res1.length==0){
        console.log("Not Enough rights to perform this operation");
        res.send('Not Enough rights to perform this operation');
      }
      else{
        console.log("Performing accepting");
        Org.declinePendingReq(orgUserId, reqUserObj, function(err2, res2){
          if(err2) throw err2;
          else{
            console.log(res2);
            console.log("Member request is declined");
            res.send('Successfull');    
          }
        });
      }
      console.log("Admin Check Successfull");
    }
  });
});

router.get('/myorg', ensureAuthentication, function(req, res, next) {
  console.log("loading organisation add page");
  var username = req.user.username;
  var userObj = {
    name: req.user.name,
    username : req.user.username
  };
  User.getUserByUsername(username, function(err1, res1){
    if(err1) throw err1;
    else{
      Org.memberOrgs(userObj, function(err2, res2){
        if(err2) throw err2;
        else{
          Org.adminOrgs(userObj, function(err3, res3){
            if(err3) throw err3;
            else{
              Org.pendingOrgs(userObj, function(err4, res4){
                if(err4) throw err4;
                else
                {
                  console.log(res2);
                  res.render('myorg',{
                    title: 'My Organisations',
                    username: req.user.username,
                    pendingctrlorgs: res4,
                    adminctrlorgs: res3,
                    memberctrlorgs: res2,
                    userDetails: res1
                  })
                }
              })
            }
          })
        }
      })
    }
  })    
});

router.get('/searchorg/:orgname', ensureAuthentication, function(req, res, next) {
  console.log("loading organisation add page");
  var username = req.user.username;
  var userObj = {
    name: req.user.name,
    username : req.user.username
  };
  User.getUserByUsername(username, function(err2,res2){
    if(err2) throw err2;
    else
    {
      var orgname = req.params.orgname;
      if(orgname=="q")
      {
            //The abouve getUserByUsername is required because to render the search dash in laptop, we are showing the userdetais
            res.render('joinorg', {
              title: 'Explore Orgs',
              username: req.user.username,
              orgsByName: [],
              userDetails: res2,
              initial: "true"
            })
          }
          
          else{

            if(req.query.suborgquery)
              orgname = req.query.suborgquery;

            console.log(orgname);
            Org.adminOrgs(userObj, function(err3, res3){
              if(err3) throw res3;
              else
              {
                Org.memberOrgs(userObj, function(err4, res4){
                  if(err4) throw res4;
                  else{
                    Org.pendingOrgs(userObj, function(err5, res5){
                      if(err5) throw err5;
                      else{
                        Org.findInOrg(orgname, function(err6, res6){
                          if(err6) throw err6;
                          else{
                            console.log(res3);
                            res.render('joinorg',{
                              title: 'Explore Orgs',
                              username: req.user.username,
                              userDetails: res2,
                              adminctrlorgs: res3,
                              memberctrlorgs: res4,
                              pendingctrlorgs: res5,
                              orgsByName: res6,
                              initial: "false"
                            })    
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }
      });          
});

router.post('/exitOrg/:orgUId', ensureAuthentication, function(req, res, next){
  var orgUId = req.params.orgUId;
  var username = req.user.username;
  var userObj = {
    name: req.user.name,
    username : req.user.username
  };
  Org.exitOrgAdmin(orgUId, userObj, function(err1, res1){
    if(err1) throw err1;
    else{
        //We have equated the following to 1 becuase of async nature of javascript. 
        // The Fact is that even after calling the exitOrgAdmin , the fucntion sees the previus state result.
        //So we need to make sure that we are not including the results of previous state of the database.
        console.log("After Exiting the org Admin");
        console.log(res1);
        Org.exitOrgMember(orgUId, userObj, function(err2, res2){
          console.log("After Exiting the org Member");
          console.log(res2);
          if(res2.admin.length==0)
          {
            console.log("No one is Admin Now. Do somehting..");
            console.log(res1);
            if(res1.members.length==1)
            {   
                //If no one is present in the organisation, just delete the organisation
                console.log("No one is member.. Finally delete the organisation");
                Issue.deleteIssueByOrgUserId(orgUId, function(err3, res3){
                  if(err3) throw err3;
                  else
                  {
                    console.log('Deletion of issues successfull');
                    Org.deleteOrgEmptyMember(orgUId, function(err4, res4){
                      if(err4) throw err4;
                      else
                      {
                        res.redirect('/myorg');
                      }
                    })
                  }
                });
            }
            else if(res1.members.length>1)
            {
              console.log("Found one member.. Make him the admin of the organisation");
              console.log(res1.members[1])
              Org.makeUserAdmin(orgUId, res1.members[1], function(err3, res3){
                if(err3) throw err3;
                else{
                  res.redirect('/myorg');
                }
              });
            }
          }
          else{
            console.log("Done");
            res.redirect('back');
          }
        })
      }
    });
});

// The following method deletes the organisation
// router.post('/delorg/:orgUId', ensureAuthentication, function(req, res, next) {
//     console.log("Initiating Deletion of Organisation");
//     var orgUId = req.params.orgUId;
//     console.log(orgUId);
//     Issue.deleteIssueByOrgUserId(orgUId, function(err1, res1){
//       if(err1) throw err1;
//       else
//       {
//         Org.deleteOrg(orgUId, req.user.username, function(err2, res2){
//           if(err2) throw err2;
//               else{
//                   res.redirect('/myorg');
//                 }   
//           });
//       }
//     });
// });

function ensureAuthentication(req, res, next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/users/login');
}


module.exports = router;
