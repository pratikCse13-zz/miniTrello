var path = require('path');
var express = require('express');
var router = express.Router();
var schemas = require('../schemas/boardSchema.js');
var boardSchema = schemas.boardSchema;
var listSchema = schemas.listSchema;

router.use('/',function(req,res){
		res.sendFile(path.resolve(__dirname+'/../public/views/boards.html'));
});

router.post('/saveCard',function(req,res){
	boardSchema.find({_id:req.body.boardId}).exec(function(err,board){
		if(!err)
		{
			board.lists.id(req.body.listId).cards.push(req.body.card);
		}	
	});
});

router.get('/getBoards',function(req,res){
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
				console.log(error);
	});	
});

router.get('/getLists',function(req,res){
	var listSend={};
	boardSchema.find({_id:req.body.boardId}).exec(function(err,board){
			listSend=board.lists;
	});
});

router.post('/saveList',function(req,res){
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