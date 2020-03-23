var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");

//HOME PAGE 
router.get("/", function(req,res){
    res.redirect("/blogs");
});
    

router.get("/blogs", function (req, res) {
    var perPage = 4;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    
    Blog.find({}).sort({_id: -1}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allBlogs) {
        Blog.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("index", {
                    blogs: allBlogs,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });
});



//NEW BLOG ROUTE
router.get("/blogs/new", function(req,res){
    res.render("new");
});
    

//CREATE BLOG ROUTE
router.post('/blogs', function(req,res){
    //create blog
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,  function(err, blog){
        if(err){
          console.log(err);
        } else{
          //console.log(blog);
          res.redirect("/blogs");
        }
        });
});

//SHOW BLOG ROUTE
router.get('/blogs/:id', function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            //console.log(foundBlog);
            res.render("show", {blog:foundBlog});
            
        }
    });
});

//EDIT BLOG ROUTE
router.get('/blogs/:id/edit', function(req,res){
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
router.put('/blogs/:id', function(req,res){
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
router.delete('/blogs/:id', function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});


module.exports = router;