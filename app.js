var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//APP CONFIG
app.use(express.static(__dirname + '/public/'));  //Tells it to use public directory
app.use(methodOverride("_method")); //_method is what it should look for in the url(what we used in edit.ejs)
app.use(bodyParser.urlencoded({extended: true}));  //to parse the req
app.use(expressSanitizer());

mongoose.connect("mongodb://localhost:27017/blogApp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");

//MONGOOSE DEPRECATION
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);



// MONGOOSE SCHEMA
var blogSchema = new mongoose.Schema({   
   title:String,
   image: String,
   body: String,
   created:{type:Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema); 

                                         
//HOME PAGE 
app.get("/", function(req,res){
    res.redirect("/blogs");
});
    
app.get('/blogs', function(req,res){
    Blog.find({}, function(err, blogs){
    if(err){
        console.log("Oh no, error");
        console.log(err);
    } else{
        console.log(blogs);
        res.render("index", {blogs:blogs})
    }
});
});



//NEW BLOG ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});
    

//CREATE BLOG ROUTE
app.post('/blogs', function(req,res){
    //create blog
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,  function(err, blog){
        if(err){
          console.log(err);
        } else{
          console.log(blog);
          res.redirect("/blogs");
        }
        });
});

//SHOW BLOG ROUTE
app.get('/blogs/:id', function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            console.log(foundBlog);
            res.render("show", {blog:foundBlog});
            
        }
    });
});

//EDIT BLOG ROUTE
app.get('/blogs/:id/edit', function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            console.log(foundBlog);
            res.render("edit", {blog:foundBlog});
        }
    });
    
});

//UPDATE BLOG ROUTE
app.put('/blogs/:id', function(req,res){
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){ //takes 3 args (id, new data, callback).  req.body.blog (blog is from edit.ejs)
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//DELETE BLOG ROUTE
app.delete('/blogs/:id', function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

//LOGIN ROUTE
app.get("/login", function(req,res){
    res.render("login");
});

//REGISTER ROUTE
app.get("/register", function(req,res){
    res.render("register");
});

//HELP ROUTE
app.get("/help", function(req,res){
    res.render("help");
});



app.listen(process.env.PORT, process.env.IP, function(){    //Env variables amazon has setup                                
   console.log("The BlogApp Server Has Started!");
}); 
