var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var Wayian = mongoose.model('Wayian');
var Diag = mongoose.model('Diag');
var Skinsurvey = mongoose.model('Skinsurvey');

router.use(function(req, res, next) {

	// if(req.method === 'GET'){
	// 	return next();
	// }

	if(!req.isAuthenticated()){
		console.log('no Authenticated');
		return res.redirect('/#login');
	}

	return next();

})


router.route('/wayian')

	.get(function(req, res) {

		Wayian.find(function(err, data){

			if(err){
				return res.send(500,err)
			}

			return res.send(data);

		});

	})

	// .post(function(req, res) {

	// 	var post = new Post();
	// 	post.text = req.body.text || req.query.text;
	// 	post.created_by = req.body.created_by || req.query.created_by;

	// 	console.log("your are posting " + post);

	// 	post.save(function(err, post) {
	// 		if(err)
	// 		{
	// 			return res.send(500, err);
	// 		}

	// 		return res.json(post);
	// 	});

	// })


router.route('/wayian/:id')

	.get(function(req, res) {
		console.log('Here comes :: ' + JSON.stringify(req.params));
		Skinsurvey.find({email:req.params.id}, function(err, skinSv){
			if(err)
			{
				res.send(err);
			}
			console.log('Here goes :: ' + JSON.stringify(skinSv));
			console.log('Here goes :: ' + skinSv);
			res.json(skinSv);
		})
	})

// 	.put(function(req, res) {
// 		Post.findById(req.params.id, function(err, post){
// 			if(err)
// 			{
// 				res.send(err);
// 			}

// 			post.created_by = req.body.created_by;
// 			post.text = req.body.text;

// 			post.save(function(err, post){
// 				if(err){
// 					res.send(err);
// 				}

// 				res.json(post);

// 			})
// 		})
// 	})

// 	.delete(function(req, res) {
// 		Post.remove({
// 			_id: req.params.id
// 		}, function(req, res){
// 			if(err){
// 				res.send(err);
// 			}

// 			res.json('deleted: (');
// 		})
// 	})

module.exports = router;
