var express = require('express');
var route = require('./routes/route');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname,'/public')));
app.use('/',route);




app.listen(Number(process.env.PORT||8000),function(){
	console.log("server is listening on 81");
});

module.exports = app;