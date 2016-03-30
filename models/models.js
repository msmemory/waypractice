var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	created_at: {type: Date, default: Date.now}
});

var postSchema = new mongoose.Schema({
	text: String,
	created_by: String,
	created_at: {type: Date, default: Date.now}
});

var doctorSchema = new mongoose.Schema({
	username: String, 
	password: String,
	name: String,
	address: String,
	tel: String,
	certi: String,
	created_at: {type: Date, default: Date.now}
});

var wayianSchema = new mongoose.Schema({
    email: String,
    name: String,
    userWay: String,
    way: String,
    wayUseDate: String,
    wayLastDate: String,
    city_code: String,
    city_name: String,
    skin_test: String,
    skin_count: String,
    os: String
});

var diagSchema = new mongoose.Schema({
	text: String,
	created_by: String,
	created_at: {type: Date, default: Date.now}
});

var skinsurveySchema = new mongoose.Schema({
	email: String,
	diagnosis_date: Date,
	condition: Number,
	skin_age: Number
});


mongoose.model("User", userSchema);
mongoose.model("Post", postSchema);

mongoose.model("Doctor", doctorSchema);
mongoose.model("Wayian", wayianSchema);
mongoose.model("Diag", diagSchema);
mongoose.model("Skinsurvey", skinsurveySchema);

