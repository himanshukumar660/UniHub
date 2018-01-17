var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Home' });
});

function isAuthenticated(req, res, next){
    if(req.isAuthenticated())
      return next;
    res.redirect('/users/login');
}

module.exports = router;
