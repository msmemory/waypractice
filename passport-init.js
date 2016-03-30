var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Doctor = mongoose.model('Doctor');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {

    	//tell passport
        console.log('serializing user:', user._id);
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {

    	//return user object back
    	Doctor.findById(id, function(err, user){

        	console.log('deserializing:', user.username);
    		return done(err, user);

    	});
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 

        	Doctor.findOne({username: username}, function(err, user){
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
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

        	Doctor.findOne({username: username}, function(err, user){
        		
        		if(err){
        			return done(err, false);
        		}

        		if(user){

        			return done('username already taken' ,false);
        		}
        		else
        		{
		    		var newDoctor = new Doctor();

					newDoctor.username = username;
					newDoctor.password = createHash(password);
					newDoctor.name = req.body.name || req.query.name;
					newDoctor.address = req.body.address || req.query.address;
					newDoctor.tel = req.body.tel || req.query.tel;
					newDoctor.certi = req.body.certi || req.query.certi;

		    		newDoctor.save(function(err, user){
		    			if(err)
		    			{
		    				return done(err, false);
		    			}
		    			else
		    			{
			    			console.log('sucessfully signed up user' + username);
			    			return done(null, newDoctor);
		    			}
		    		});
        		}
        	});
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