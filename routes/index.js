var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//LANDING Page
router.get("/", (req, res) => {
    res.render("landing");
});



//Auth Routes
//Register Route
router.get("/register", (req, res) => {
    res.render("register");
})

router.post("/register", (req, res) =>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        } else {  
                passport.authenticate("local")(req, res, () => {
                // let tempname = user.username.toUpperCase();
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            })
        }
    })
})


//login Route
router.get("/login", (req, res) => {  
    res.render("login");
})

router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), (req, res) => {})

//logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you Out!");     
    res.redirect("/campgrounds");
})

module.exports = router;