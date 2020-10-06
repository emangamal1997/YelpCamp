var express=require("express");
var router= express.Router();
var	campground=require("../module/campground");

router.get("/", function(req, res){
    // Get all campgrounds from DB
   campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds",{campgrounds:allCampgrounds});
       }
    });
});
router.post("/",isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
	var discription = req.body.discription;
	var price =req.body.price;
   
    var newCampground = {name: name, image: image , discription:discription , price:price};
    // Create a new campground and save to DB
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
			 newlyCreated.auther.id=req.user._id;//انا الى عملتها لوحدى , عااااش 
			 newlyCreated.auther.username=req.user.username;
			 newlyCreated.save();//
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});
 
router.get("/:id/edit",checkOwner,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err)
			console.log(err);
		else
	{ console.log(campground);
          res.render("editCamps",{campground:campground});
	}
	});		
});


router.post("/:id/edit",checkOwner,function(req,res){
	campground.findByIdAndUpdate(req.params.id , req.body.campground,function(err,updated){
		if(err)
			console.log(err);
		else
			res.redirect("/campgrounds/" + req.params.id);

	});
});


router.get("/new", isLoggedIn,function(req, res){
   res.render("new.ejs"); 
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
           // console.log(foundCampground)
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

 router.delete("/:id",checkOwner,function(req,res){
	campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
           campground.remove();
           res.redirect("/campgrounds");
       }
   });  
 });
//نقل قوس الفانكشن
//نقفل قوس الاف 
//نحط الالس

function checkOwner(req,res,next){
	if(req.isAuthenticated()){
		campground.findById(req.params.id, function(err,campground){
       if(err)
           res.redirect("back");
       else {
		  // console.log(campground.auther);
		   if(campground.auther.id.equals(req.user._id) || req.user.isAdmin){
			   next();
		   }
		   else
			   {  req.flash("error", "You need to be logged in to do that");
				  res.redirect("back"); 
			   }
}
		});
							}
							else
							{
							res.render("login");
							}
		};		
			
			
			
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
 req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}

		
							};

module.exports=router;