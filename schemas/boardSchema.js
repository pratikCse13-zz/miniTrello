var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = "mongodb://pratik:pratik@ds153845.mlab.com:53845/trelloswiggified";

var connection = mongoose.createConnection(db);

var ObjectId = Schema.ObjectId;

var list = new Schema({
	name : String,
	cards : [String]
});

var board = new Schema({
	name : String,
	lists : [list]
});

module.exports.boardSchema = mongoose.model('board',board);
module.exports.listSchema = mongoose.model('list',list);