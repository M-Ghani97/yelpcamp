const express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Comment = require('./models/comment')
var Campground = require('./models/campground')
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");
var seedDB = require('./seeds')

//Mongoose Config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://M_Ghani97:jx2pn407z@firstcluster-ac9wv.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true 
    }).then(() => {
        console.log("DB Connected!");
    }).catch(err => {   
        console.log(err.message);
    });
app.use(express.static(__dirname + "/public"));
app.use(flash());

//Passport Config
app.use(require("express-session")({
    secret: "this is my first app",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// seedDB();


app.listen(3000, () => {
    console.log("YelpCamp Server is Started!");
});