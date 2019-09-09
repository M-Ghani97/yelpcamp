var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");

//INDEX - Show all campgrounds 
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
});


//CREATE - Add new Campgrounds 
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: name,
        image: image,
        desc: desc,
        author: author
    }
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err);   
        } else {
            req.flash("success", "New Campground Added");
            res.redirect("/campgrounds");
        }
    }) 
});

//NEW - show form to create new campground
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})

//SHOW - show detailed contents of single ID
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campgrounds: foundCampground});
        }
    })    
})

//EDIT Routes
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            res.render("campgrounds/edit", {campground: foundCampground});
    })
})

//UPDATE Route
router.put("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampgroud) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "New Campground Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//DESTROY Route
router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if(err) {
            console.log(err)
        } else {
            req.flash("error", "Campground Deleted");
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;