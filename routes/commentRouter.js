var express=require("express");
var router= express.Router({mergeParams: true});
var	campground=require("../module/campground");
var comment=require("../module/comments");




router.get("/new",isLoggedIn, function(req, res){
    // find campground by id
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("newComment", {campground: campground});
        }
    })
});

router.post("/",isLoggedIn,function(req,res){
	 campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        comment.create(req.body.comments, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   comment.auther.id=req.user._id;
			   comment.auther.username=req.user.username;
			  comment.save();//كان فى ايرور قبل ما نحطه

               campground.comments.push(comment);
               campground.save();
			                  req.flash("success", "Successfully added comment");

               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
});
});
//ما تنسيش ال: قبل الاى دى
router.get("/:commentID/edit",checkOwner,function(req,res){
	 comment.findById(req.params.commentID, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
	
	res.render("editComment",{comment:foundComment , campground_id:req.params.id});
	  }
	 });
});

router.post("/:commentID/edit",checkOwner,function(req,res){
	comment.findByIdAndUpdate(req.params.commentID,req.body.comment,function(err,updatedComment)
							 {
		if(err)
			res.redirect("back");
		else
			{
				res.redirect("/campgrounds/" + req.params.id );
			}
	}
							 )
});
router.delete("/:commentID",checkOwner,function(req,res){
	comment.findById(req.params.commentID, function(err, comment){
       if(err){
           console.log(err);
       } else {
           comment.remove();
           res.redirect("/campgrounds/"+req.params.id);
       }
   });  
 });

function checkOwner(req,res,next){
	if(req.isAuthenticated()){
		comment.findById(req.params.commentID, function(err,comment){
       if(err)
           res.redirect("back");
       else {
		   console.log(comment);
		   if(comment.auther.id.equals(req.user._id) || req.user.isAdmin){
			   next();
		   }
		   else
			   {  req.flash("error", "You don't have permission to do that");
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