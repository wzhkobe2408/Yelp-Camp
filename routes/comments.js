var express = require('express')
var router = express.Router({mergeParams:true})
var comment = require('../models/comment')
var campground = require('../models/campground')

router.get('/new',isLoggedIn,function(req,res){
  campground.findById(req.params.id,function(err,foundCamp){
    if(err){
      console.log(err)
    }else{
      res.render('comment/new',{campground:foundCamp})
    }
  })
})

router.post('/',isLoggedIn,function(req, res){
  campground.findById(req.params.id,function(err, foundCamp) {
    if(err) {
      console.log(err)
      res.redirect('/campgrounds')
    }else {
      comment.create(req.body.comment,function(err, comment){
        if(err) {
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
              res.redirect('/campgrounds/' + foundCamp._id);
            }
          });
        }
      })
    }
  })
})

router.get('/:comment_id/edit',checkCommentOwner,function(req, res) {
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

router.put('/:comment_id',checkCommentOwner,function(req, res){
  comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back");
    }else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

router.delete('/:comment_id',checkCommentOwner,function(req, res){
  comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err) {
      res.redirect("back");
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

//middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkCommentOwner(req, res, next){
  if(req.isAuthenticated()){
    comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
        res.redirect('/campgrounds/' + req.params.id)
      } else {
        if(foundComment.author.id.equals(req.user._id)){
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
