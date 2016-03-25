var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

//temporary data store
var users = {
	// "stephen": {
	// 							"username" : "stephen",
	// 							"password" : "$2a$10$BQWRhn2cCNxk4uMSJGLVSuA472mUXSnvnkBqlYKGVMuVDYqVX6uq."
	// 							}
};

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {

    	//tell passport
        console.log('serializing user:', user._id);
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {

    	//return user object back
    	User.findById(id, function(err, user){

        	console.log('deserializing:', user.username);
    		return done(err, user);

    	});
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 

        	User.findOne({username: username}, function(err, user){
        		if(err){
        			return done(err, false);
        		}

        		if(!user){
        			return done('user ' + username + ' not found!', false);
        		}

        		if(!isValidPassword(user, password)){
        			// wrong password!
        			return done('incorrect password', false);
        		}

        		console.log('sucessfully login ' + user);
        		return done (null, user);
        	})

        	// if(!users[username]){
        	// 	return done('user not found', false);
        	// }

        	// if(isValidPassword(users[username], password)){
        	// 	return done('invalid password', false);
        	// }

        	// //sucessully signed in
        	// console.log('sucessfully signed in');

         //    return done(null, users[username]);
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

        	User.findOne({username: username}, function(err, user){
        		
        		if(err){
        			return done(err, false);
        		}

        		if(user){

        			return done('username already taken' ,false);
        		}
        		else
        		{
		    		var newUser = new User();

					newUser.username = username;
					newUser.password = createHash(password);

		    		newUser.save(function(err, user){
		    			if(err)
		    			{
		    				return done(err, false);
		    			}
		    			else
		    			{
			    			console.log('sucessfully signed up user' + username);
			    			return done(null, newUser);
		    			}
		    		});
        		}
        	});


        	// //check if the user already exists
        	// if(users[username]){
        	// 	return done('username already taken', false);
        	// }

        	// //add user to db
        	// users[username] = {
        	// 	username: username,
        	// 	password: createHash(password)
        	// };

			// console.log(users);

            // return done(null, users[username]);
        }
    ));

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(2015), null);
    };

};