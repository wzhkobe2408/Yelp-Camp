var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var methodOverride = require('method-override')
var flash = require('connect-flash')

var commentRoutes = require('./routes/comments')
var authRoutes = require('./routes/index')
var campgroundRoutes = require('./routes/campgrounds')

var user = require('./models/user')

mongoose.connect('mongodb://localhost/yelp_camp_app')

var app = express()

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())
app.use(bodyParser.urlencoded({extended:true}))

app.use(require('express-session')({
  secret:"I am try to do something special",
  resave:false,
  saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
})

passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use('/',authRoutes)
app.use('/campgrounds/:id/comments',commentRoutes)
app.use('/campgrounds',campgroundRoutes)

app.listen(3000,function(){
  console.log("App is listening on port 3000...")
})
