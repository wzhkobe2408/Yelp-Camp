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
    failureRedirect:'/login',
    failureFlash: 'Invalid username or password.'
  }),function(req,res){
})

router.post('/register',function(req,res){
    var newUser = new user({username:req.body.username});
    user.register(newUser,req.body.password,function(err, user){
      if(err){
        req.flash('error',err.message);
        return res.redirect('/register')
      }
      passport.authenticate('local')(req,res,function() {
        req.flash('success','Welcome to YelpCamp' + user.username);
        res.redirect('/campgrounds')
      })
    })
  })

router.get('/logout',function(req, res){
  req.flash('success','Logged you out!')
  req.logout();
  res.redirect('/campgrounds');
})

module.exports = router
