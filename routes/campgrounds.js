var express = require('express')
var router = express.Router()
var campground = require('../models/campground')
var middleware = require('../middleware')

router.get('/',function(req,res){
  campground.find({},function(err,campgrounds){
    if(err){
      console.log(err)
    }else {
      res.render('campground/campgrounds',{campgrounds:campgrounds})
    }
  })
})

router.get('/new',middleware.isLoggedIn,function(req,res){
  res.render('campground/new')
})

router.post('/',middleware.isLoggedIn,function(req, res){
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

router.get('/:id/edit',middleware.checkCampOwner,function(req, res) {
  campground.findById(req.params.id, function(err, foundCamp) {
        res.render('campground/edit',{campground:foundCamp})
    })
  }
)

router.put('/:id',middleware.checkCampOwner,function(req, res) {
  campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCamp) {
    if(err) {
      return res.redirect('/campgrounds')
    }
    res.redirect('/campgrounds/' + req.params.id)
  })
})

router.delete('/:id',middleware.checkCampOwner,function(req, res) {
  campground.findByIdAndRemove(req.params.id,function(err){
    if(err) {
      return res.redirect('/campgrounds')
    }
    res.redirect('/campgrounds')
  })
})

module.exports = router
