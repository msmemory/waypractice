var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	created_at: {type: Date, default: Date.now}
});

var doctorSchema = new monoose.Schema({
	username: String, 
	password: String,
	name: String,
	address: String,
	tel: String,
	certi: String,
	created_at: {type: Date, default: Date.now}
})

var postSchema = new mongoose.Schema({
	text: String,
	created_by: String,
	created_at: {type: Date, default: Date.now}
});


mongoose.model("User", userSchema);
mongoose.model("Post", postSchema);