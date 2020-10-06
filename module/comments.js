var	mongoose =require("mongoose");

var commentSchema = new mongoose.Schema({
	comment:String,
	createdAt:{type:Date , default:Date.now},
	auther:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String,
	}
	
});
 module.exports = mongoose.model("Comment", commentSchema);
