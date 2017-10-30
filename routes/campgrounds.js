var express = require('express')
var router = express.Router()
var campground = require('../models/campground')

router.get('/',function(req,res){
  campground.find({},function(err,campgrounds){
    if(err){
      console.log(err)
    }else {
      res.render('campground/campgrounds',{campgrounds:campgrounds})
    }
  })
})

router.get('/new',isLoggedIn,function(req,res){
  res.render('campground/new')
})

router.post('/',isLoggedIn,function(req, res){
  var newCampground = req.body.campground;
  var author = {
    id:req.user._id,
    username:req.user.username
  };
  newCampground.author = author;
  campground.create(newCampground,function(err,campground){
    if(err){
      console.log(err);
      return res.redirect('/campgrounds/new')
    }
    res.redirect('/campgrounds')
  })
})

router.get('/:id',function(req,res){
  campground.findById(req.params.id).populate('comments').exec(function(err,foundCamp){
    if(err){
      console.log(err)
    } else {
      res.render('campground/show',{campground:foundCamp})
    }
  })
})

router.get('/:id/edit',checkCampOwner,function(req, res) {
  campground.findById(req.params.id, function(err, foundCamp) {
        res.render('campground/edit',{campground:foundCamp})
    })
  }
)

router.put('/:id',checkCampOwner,function(req, res) {
  campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCamp) {
    if(err) {
      return res.redirect('/campgrounds')
    }
    res.redirect('/campgrounds/' + req.params.id)
  })
})

router.delete('/:id',checkCampOwner,function(req, res) {
  campground.findByIdAndRemove(req.params.id,function(err){
    if(err) {
      return res.redirect('/campgrounds')
    }
    res.redirect('/campgrounds')
  })
})

//middleware

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkCampOwner(req, res, next) {
  if(req.isAuthenticated()){
    campground.findById(req.params.id, function(err, foundCamp) {
      if(err) {
        res.redirect('/campgrounds/' + req.params.id)
      } else {
        if(foundCamp.author.id.equals(req.user._id)){
          next()
        } else {
          res.redirect('/campgrounds/' + req.params.id)
        }
      }
    })
  } else {
    res.redirect('/campgrounds/' + req.params.id);   //previous page
  }
}

module.exports = router
