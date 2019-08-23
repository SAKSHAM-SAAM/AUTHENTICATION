var express                 = require("express");
var mongoose                = require("mongoose");
var passport                = require("passport");
var bodyParser              = require("body-parser");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
var User                    = require("./models/User");
var session                 = require("express-session");
var middlewareObj = {};

mongoose.connect("mongodb://localhost:27017/auth_demo1", {useNewUrlParser: true});

var app         = express(); 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret:"SAAM Corporation",
    resave: true,
    saveUninitialized: true,
    
}));
app.use(express.static("public"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//---------------------------------------
//routes
//---------------------------------------
app.use(passport.initialize())
app.use(passport.session())
app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){ //middle ware {login : check}
        res.render("secret");      
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    // saving data
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//--------------------------------------
//LOGIN
//--------------------------------------
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login",passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect : "/login"
}))

//-------------------------------------
//logout 
//-------------------------------------
app.get("/logout", function(req , res){
    req.logOut();
    res.redirect("/");
});
//-------------------------------------

 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    // console.log(req.isAuthenticated());
    res.redirect("/login");
  }
//-----------------------------------------

app.listen(2400, function(){
    console.log("SERVER:_ONLINE")
});