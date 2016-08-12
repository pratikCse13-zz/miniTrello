var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = "mongodb://pratik:pratik@ds153845.mlab.com:53845/trelloswiggified";

var connection = mongoose.createConnection(db);

var user = new Schema({
	name: String,
	emailId: String,
	password: String
});

module.exports.userSchema = connection.model('user',user);