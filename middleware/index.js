var campground = require('../models/campground')
var comment = require('../models/comment')

var middlewareObj = {};

middlewareObj.checkCampOwner = function(req, res, next) {
  if(req.isAuthenticated()){
    campground.findById(req.params.id, function(err, foundCamp) {
      if(err) {
        req.flash('error','Campground not found');
        res.redirect('/campgrounds/' + req.params.id)
      } else {
        if(foundCamp.author.id.equals(req.user._id)){
          next()
        } else {
          req.flash('error',"You don't have permission to do that");
          res.redirect('/campgrounds/' + req.params.id)
        }
      }
    })
  } else {
    req.flash('error','You need to be logged in to do that');
    res.redirect('/campgrounds/' + req.params.id);   //previous page
  }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
    if(req.isAuthenticated()){
      comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
          req.flash('error','Comment not found');
          res.redirect('/campgrounds/' + req.params.id)
        } else {
          if(foundComment.author.id.equals(req.user._id)){
            next()
          } else {
            req.flash('error',"You don't have permission to do that");
            res.redirect('/campgrounds/' + req.params.id)
          }
        }
      })
    } else {
      req.flash('error','You need to be logged in to do that');
      res.redirect('/campgrounds/' + req.params.id);   //previous page
    }
  }

middlewareObj.isLoggedIn = function(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error','You need to be logged in to do that');
  res.redirect('/login');
}

module.exports = middlewareObj
