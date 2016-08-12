var express = require('express');
var route = express.Router();
var util = require('util');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var schemas = require('../schemas/userSchema.js');
var bcrypt = require('bcryptjs');
var userSchema = schemas.userSchema;
var jwt = require('jwt-simple');
var db = 'mongodb://pratik:qwerty@ds029725.mlab.com:29725/fashboard';
var JWT_SECRET = "flamingo";

route.use(bodyParser.json());
route.use(bodyParser.urlencoded({extended:true}));

route.use(validator());

route.post('/newUser',function(req,res){

	userSchema.findOne({emailId:req.body.emailId}).exec(function(err,user){
		if(user!=null)
		{
			res.json({msg:"email is already registered"});
		}
		if(user==null)
		{
			req.check('password','password should be atleast 6 charaters ').isLength({min:6,max:20});
			req.check('emailId','email is not valid').isEmail();
			var errors = req.validationErrors();
			var msg = "";
			if(errors)
			{
				for(var i=0;i<errors.length;i++)
				{
					if(errors[i].param=="emailId")
						msg = msg + errors[i].msg;
					if(errors[i].param=="password")
						msg = msg + errors[i].msg;
				}
				res.json({msg:msg});
			}
			else
			{
				bcrypt.genSalt(10,function(err,salt){
				bcrypt.hash(req.body.password,salt,function(err,hash){
				var newUser = new userSchema({
					name : req.body.name,
					emailId : req.body.emailId,
					password : hash
				});
				console.log(req.body);
				newUser.save(function(err){
					if(err)
						res.json({msg:"unsuccessful registration try again"});
					else
					{
						var token = jwt.encode(newUser,JWT_SECRET);
						res.json({msg:"successful registration",token:token});
					}
				});
				});
				});
			}
		}
		if(err)
		{
			res.json({msg:'unsuccessful registration try again'});
		}
	});
			
});

route.post('/checkToken',function(req,res){
		console.log("called");
		var tokenUser = jwt.decode(req.body.token,JWT_SECRET);
		console.log(tokenUser);
		userSchema.findOne({emailId:tokenUser.emailId}).exec(function(err,user){
			if(err)
			{
					res.send("error1");
			}
			else
			{
				if(user==null)
				{
					res.send("no user");
				}
				else
				{
					bcrypt.compare(tokenUser.password,user.password,function(err,result){
							if(err)
							{
								res.send('err2');
							}
							else
							{
								if(result)
									res.send("successful token");
								else
									res.send("passowrd didnt match");
							}
				});
				}
			}	
		});
		
});

route.post('/loginUser',function(req,res){
		console.log("called");
		userSchema.findOne({emailId: req.body.emailId}).exec(function(err,user){
			if(err)
				res.json({msg:"retry login"});
			if(user==null)
				res.json({msg:"email doesnt exist"});
			else
			{
				bcrypt.compare(req.body.password,user.password,function(err,response){
					if(err)
						res.json({msg:"retry login"});
					else
						{
							if(response)
							{
								var token = jwt.encode(user,JWT_SECRET);
								res.json({msg:"login successful",token:token});
							}
							else
								res.json({msg:"Password is wrong"});
						}

				});
			}
		});
});

module.exports = route;

