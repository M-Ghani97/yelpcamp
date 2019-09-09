var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var middlewareObj = require("../middleware");

//NEW -show form to add new comments
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    console.log(req.params.id);
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err)
        } else{
            res.render("comments/new", {campground: campground})
        }
    })
})



//CREATE - Add new Comments 
router.post('/', middlewareObj.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, newCampground) => {
        if(err){
            console.log(err);
        } else{
            Comment.create(req.body.comment, (err, newComment) => {
                if(err){
                    console.log(err);
                } else{
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    console.log(newComment);
                    newComment.save();
                    newCampground.comments.push(newComment)
                    newCampground.save();
                    res.redirect("/campgrounds/" + newCampground._id)
                }
            })
        }
    })
})

//EDIT -Edit Comments
router.get("/:commentId/edit", middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: comment, campground_id: req.params.id});
        }
    })
})

//UPDATE Route
router.put("/:commentId", middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, updateComment) => {
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//DELETE Route
router.delete("/:commentId", middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId, (err) => {
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id); 
        }
    })
})

module.exports = router;