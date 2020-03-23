var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require('passport');

//AUTH ROUTES

router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register", function(req,res){
    //Passport logic saving to database
    var newUser= new User({username:req.body.username,email:req.body.email });
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){ //Logs user in, stores info, runs serialize user method, (local is a strategy we may use other, twitter etc.)
            res.redirect("/blogs");
        });
    });
});

router.get("/login", function(req,res){
    res.render("login");
});

router.post('/login', passport.authenticate("local",{   
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function (req, res) {
    
});


router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/blogs");
});

//HELP ROUTE
router.get("/help", function(req,res){
    res.render("help");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;