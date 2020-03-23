var express = require("express");
var app = express();
let ejs = require('ejs');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var Blog = require("./models/blog");
var blogRoutes = require("./routes/blogs.js");
var authRoutes = require("./routes/index.js");



//APP CONFIG
app.use(express.static(__dirname + '/public/'));  //Tells it to use public directory
app.use(methodOverride("_method")); //_method is what it should look for in the url(what we used in edit.ejs)
app.use(bodyParser.urlencoded({extended: true}));  //to parse the req
app.use(expressSanitizer());
app.set("view engine", "ejs");



//MONGOOSE CONFIG
mongoose.connect("mongodb://localhost:27017/blogApp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);



//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "New York Knicks",
    //secret is used to decode the encoded information in the session
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); // Sets passport up
app.use(passport.session());    // We need these 2 lines any time passport is used 
passport.use(new LocalStrategy(User.authenticate())); //Creating a new local strategy using User.auth method that is coming from pass-loc-mong
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){      //passes var curretUser to all routes
    res.locals.currentUser = req.user;
    next();
});

                                      
app.use(blogRoutes);
app.use(authRoutes);


app.listen(process.env.PORT, process.env.IP, function(){    //Env variables amazon has setup                                
   console.log("The BlogApp Server Has Started!");
}); 
