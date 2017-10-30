var express = require('express')
var router = express.Router()
var user = require('../models/user')
var passport = require('passport')

router.get('/',function(req,res){
  res.render('index')
})

router.get('/login',function(req,res){
  res.render('account/login')
})

router.get('/register',function(req,res){
  res.render('account/register')
})

router.post('/login',passport.authenticate('local',
  {
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
  }),function(req,res){
})

router.post('/register',function(req,res){
    var newUser = new user({username:req.body.username});
    user.register(newUser,req.body.password,function(err, user){
      if(err){
        console.log(err);
        return res.render('account/register')
      }
      passport.authenticate('local')(req,res,function() {
        res.redirect('/campgrounds')
      })
    })
  })

router.get('/logout',function(req, res){
  req.logout();
  res.redirect('/campgrounds');
})

//middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router
