var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');
var schemas = require('../schemas/boardSchema.js');
var boardSchema = schemas.boardSchema;
var listSchema = schemas.listSchema;
var cardSchema = schemas.cardSchema;

var db = "mongodb://pratik:pratik@ds153845.mlab.com:53845/trelloswiggified";



router.use(bodyParser());
router.get('/',function(req,res){
		res.sendFile(path.resolve(__dirname+'/../public/views/index.html'));
});

router.post('/getCards',function(req,res){
	cardSchema.find({board: req.body.boardId}).exec(function(err,cards){
		res.json(cards);
	});
});

router.get('/getBoards',function(req,res){
	boardSchema.find({}).exec(function(err,boards){
		res.json(boards);
	});
});

router.post('/getLists',function(req,res){
	listSchema.find({board: req.body.boardId}).exec(function(err,lists){
			res.json(lists);
	});
});

router.post('/saveBoard',function(req,res){
	var board = new boardSchema({name: req.body.boardName});
	board.save(function(err,doc){
		if(!err)
		{
			console.log('new board '+req.body.boardName+' successfully saved');
			res.json(doc);
		}
		else
		{
			console.log('error: '+err);
		}
	});	
});

router.post('/saveList',function(req,res){
	console.log(req.body);
	var list = new listSchema({
		name: req.body.listName,
		board: mongoose.Types.ObjectId(req.body.boardId)
	});
	list.save(function(err,list){
		if(err)
		{
			console.log('error: '+err);
		}	
		else
		{
			res.json({name: req.body.listName,id: list._id});
		}
	});
});

router.post('/saveCard',function(req,res){
	var card = new cardSchema({
		content: req.body.content,
		list: mongoose.Types.ObjectId(req.body.listId),
		board: mongoose.Types.ObjectId(req.body.boardId) 
	});
	card.save(function(err,card){
		if(err)
		{
			console.log('error : '+err);
		}
		else
		{
			console.log('new card saved');
			res.json(card);
		}
	});
});

router.post('/updateDrop',function(req,res){
		cardSchema.findById(req.body.id,function(err,card){
			var temp = card;
			temp.list = req.body.list;
			cardSchema.findOneAndUpdate({_id: req.body.id},{$set:temp},{upsert:true},function(err,res){
				if(!err)
					console.log('card updated on dnd successfully');
			});
		})
});

module.exports = router;

/*boardSchema.findById(req.body.boardId,function(err,board){
		if(!err)
		{
			if(board.lists!=null)
			{
				var listIds = board.lists;
				for(var i=0;i<listIds.length;i++)
				{
					listSchema.findById(listIds[i],function(err,list){
						listSend.push(list);
						if(listSend.length==listIds.length)
						{
							console.log('here is listSend :'+listSend);
							res.send(listSend);
						}
					});
				}	
			}
		}
		else
		{
			console.log('error');
		}
	});*/

	/*
	boardSchema.findById(req.body.boardId,function(err,board){
		var updatedBoard = board;
		updatedBoard.lists.push(newListId);
		boardSchema.findOneAndUpdate({_id: req.body.boardId},{$set: updatedBoard},{upsert: true},function(err,board){
			if(err)
			{
				console.log('error in updating new list to board: '+err);
			}
			else
			{
				console.log(board);
			}
		});
	});*/
