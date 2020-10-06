var express=require("express");
var router= express.Router();
var User = require("../module/user");
var passport = require("passport");




router.get("/", function(req, res){
    res.render("landing");
});




//================
//AUTH ROUTS
//================
router.get("/register",function(req,res){
	
		res.render("register");

});

router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username});
	
	User.register(newUser,req.body.password,function(err,user){
	if(err)
		{
			console.log(err);
		  req.flash("error", err.message);

			res.redirect("/register");
		}
	else{
		 passport.authenticate("local")(req, res, function(){
			            req.flash("success", "Welcome to YelpCamp " + user.username);

           res.redirect("/campgrounds");
        });
	}	
	});
});
//
router.get("/adminregister",function(req,res){
	
		res.render("adminregister");

});

router.post("/adminregister",function(req,res){
	var newUser=new User({username:req.body.username});
	
	User.register(newUser,req.body.password,function(err,user){
	if(err)
		{
			console.log(err);
		  req.flash("error", err.message);

			res.redirect("/adminregister");
		}
	else{
		 passport.authenticate("local")(req, res, function(){
			            req.flash("success", "Welcome to YelpCamp " + user.username);

           res.redirect("/campgrounds");
        });
	}	
	});
});

router.get("/login",function(req,res){
	res.render("login", {message:req.flash("error")});
});

router.post("/login" , passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"

}),function(req,res){}
		 );

router.get("/logout",function(req,res){
	    req.logout();
	 req.flash("success", "Logged you out!");
		res.redirect("/");
	
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{ req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

module.exports=router;