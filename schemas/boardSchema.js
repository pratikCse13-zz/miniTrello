var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = "mongodb://pratik:pratik@ds153845.mlab.com:53845/trelloswiggified";

var connection = mongoose.createConnection(db);

var list = new Schema({
	name : String,
	board : mongoose.Schema.Types.ObjectId
});

var board = new Schema({
	name : String
});

var card = new Schema({
	content : String,
	list : mongoose.Schema.Types.ObjectId,
	board : mongoose.Schema.Types.ObjectId
});

module.exports.boardSchema = connection.model('board',board);
module.exports.listSchema = connection.model('list',list);
module.exports.cardSchema = connection.model('card',card);