var express = require("express"),
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose =require("mongoose"),
	campground=require("./module/campground"),
	comment=require("./module/comments"),
	passport              = require("passport"),
    User                  = require("./module/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    commentRoutes         = require("./routes/commentRouter"),
	campgroundRoutes      = require("./routes/campgroundRouter"),
	indexRouter           = require("./routes/indexRouter"),
     methodOverride = require("method-override"),
	flash               = require("connect-flash");    




mongoose.connect("mongodb+srv://dbeman:123456789password@cluster0-lmz6o.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useCreateIndex: true
     }).then(() => {
	console.log('Connected to DB!');
       }).catch(err => {
	console.log('ERROR:', err.message);
          });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment=require("moment");
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
	res.locals.currentUser=req.user; //هتخلينى اعرف استخدم المعلومات بتاعه اليوزر جوا التمبلت
	res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
	next();
	
});
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments" ,commentRoutes);
app.use(indexRouter);
app.use(express.static(__dirname + "/public"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});