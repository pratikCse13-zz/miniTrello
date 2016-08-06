var express = require('express');
var path = require('path');

var router = express.Router();

router.use('/',function(req,res){
		res.sendFile(path.resolve(__dirname+'/../public/views/index.html'));
});

module.exports = router;