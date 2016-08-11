var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bosyParser = require('body-parser');
var schemas = require('../schemas/boardSchema.js');
var boardSchema = schemas.boardSchema;
var listSchema = schemas.listSchema;

var db = "mongodb://pratik:pratik@ds153845.mlab.com:53845/trelloswiggified";

mongoose.createConnection(db);

router.use(bosyParser());
router.get('/',function(req,res){
		res.sendFile(path.resolve(__dirname+'/../public/views/boards.html'));
});

router.post('/saveCard',function(req,res){
	console.log('saveCard called');
	boardSchema.find({_id:req.body.boardId}).exec(function(err,board){
		if(!err)
		{
			board.lists.id(req.body.listId).cards.push(req.body.card);
		}	
	});
});

router.get('/getBoards',function(req,res){
	console.log('getBoard called');
	var boardSend=[];
	boardSchema.find({}).exec(function(err,boards){
		for(var i=0;i<boards.length;i++)
		{
			boardSend.push({
				name: boards[i].name,
				id: boards[0]._id
			});
		}
		res.json(boardSend);
	});
});

router.post('/saveBoard',function(req,res){
	console.log('saveBoard called');
	var board = new boardSchema({name: req.body.boardName});
	board.save(function(err,board){
			if(!err)
			{
				console.log(board);
				res.json(board);
			}
			else
				console.log(err);
	});	
});

router.get('/getLists',function(req,res){
	console.log('getLists called');
	var listSend={};
	boardSchema.find({_id:req.body.boardId}).exec(function(err,board){
			listSend=board.lists;
	});
});

router.post('/saveList',function(req,res){
	console.log('saveList called');
	var list = new listSchema({
		name: req.body.listName
	});
	boardSchema.find({_id:req.body.boardId}).exec(function(err,board){
		if(!err)
		{
			board.lists.push(list);
		}
	});
});

module.exports = router;