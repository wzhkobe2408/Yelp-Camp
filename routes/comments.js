var express = require('express')
var router = express.Router({mergeParams:true})
var comment = require('../models/comment')
var campground = require('../models/campground')
var middleware = require('../middleware')

router.get('/new',middleware.isLoggedIn,function(req,res){
  campground.findById(req.params.id,function(err,foundCamp){
    if(err){
      console.log(err)
    }else{
      res.render('comment/new',{campground:foundCamp})
    }
  })
})

router.post('/',middleware.isLoggedIn,function(req, res){
  campground.findById(req.params.id,function(err, foundCamp) {
    if(err) {
      console.log(err)
      res.redirect('/campgrounds')
    }else {
      comment.create(req.body.comment,function(err, comment){
        if(err) {
          req.flash('error','Something went wrong');
          console.log(err)
        }else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          foundCamp.comments.push(comment);
          foundCamp.save(function(err, foundCamp){
            if(err) {
              console.log(err)
            } else {
              req.flash('success','Successfully added comment')
              res.redirect('/campgrounds/' + foundCamp._id);
            }
          });
        }
      })
    }
  })
})

router.get('/:comment_id/edit',middleware.checkCommentOwner,function(req, res) {
    comment.findById(req.params.comment_id, function(err,foundComment){
      if(err){
        res.redirect("back");
      }else {
        res.render('comment/edit',
        {
          campground_id:req.params.id,
          comment:foundComment
        }
      )
      }
    })
})

router.put('/:comment_id',middleware.checkCommentOwner,function(req, res){
  comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back");
    }else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

router.delete('/:comment_id',middleware.checkCommentOwner,function(req, res){
  comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err) {
      res.redirect("back");
    } else {
      req.flash('success','Comment deleted');
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

module.exports = router
