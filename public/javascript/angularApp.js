var app = angular.module('app',[]);

app.controller('appCtrl',function($scope,$http,$window){

	
	$scope.showModal=true;          //toggles display of login modal
	$scope.username="";				//sets the username of the user
	$scope.users={};				//list of online users
	$scope.msg="";					//reply fed by the user
	$scope.interact=true;			//modulates the access of input form
	$scope.chatWith={};				//user currently chatting with
	$scope.messages={};				//record of messages received
	$scope.badgeCounter={};			//number of unread messages
	$scope.showError=false;			//controls display of validation error 
	$scope.error="";				//validation error
	$scope.file=[];					//temporary variable
	$scope.receiverHistory={};		//temporary variable
	$scope.messageHistory={};		//temporary variable
	$scope.imageHistory={};			//temporary variable
	
	var socket = io.connect();
	var html='';
	var flag=false;

	// creates a thumbnail view of PDF
	function thumbnail(pdfURL, elementID, style) {
    	PDFJS.workerSrc = '/javascript/pdf.worker.js';
    	PDFJS.getDocument(pdfURL).then(function (pdf){
        	pdf.getPage(1).then(function (page){  
            var viewport = page.getViewport(0.5);
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            page.render(renderContext).then(function (){
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                var img = canvas.toDataURL();
                if(style=="send")
                {
                	$("#" + elementID).append('<li style="background-color: #ECECEC; clear: both; width: 100%; margin: 10px"><img src="' + img + '" class="popUpActivator" style="float: left; width: 150px; height: 180px; margin: 10px; border: 2px solid #3B5998"/></li>');
            	}
            	if(style=="receive")
            	{
            		$("#" + elementID).append('<li style="background-color: #ECECEC; clear: both; width: 100%; margin: 10px; margin-right: 20px;"><img src="' + img + '" class="popUpActivator" style="float: right; width: 150px; height: 180px; margin: 10px; border: 2px solid white"/></li>');	
            	}
            });
        });
    });
    	
}

	// function to add a delay
	function sleep(milliseconds) {
			  var start = new Date().getTime();
  			  for (var i = 0; i < 1e7; i++) {
    				if ((new Date().getTime() - start) > milliseconds){
      				break;
    				}
 			 }
	}

	// function changes the user currently chatting with
	$scope.changeReceiver = function(user){
		console.log('changeReceiver called');
		$scope.interact=false;
		$scope.chatWith=user;
		$scope.badgeCounter[user.username]=0;
		$('#chatList').html("");
		html = '';
		var array = $scope.messages[$scope.chatWith.username];
		for(var i=0;i<array.length;i++)
		{
			$scope.receiverHistory=array[i];
			if(array[i].genre=="message")
			{
				if(array[i].status=="send")
				{
					$('#chatList').append('<li style="clear: both; float: left; border-top-right-radius: 7px; border-bottom-right-radius: 7px; border-bottom-left-radius: 12px; height: 30px;  line-height: 10px; padding: 10px; margin: 10px;" class="list-group-item"><span style="float: left; line-height: 10px">'+$scope.receiverHistory.message+'</span></li>');
				}
				else
				{
					$('#chatList').append('<li style="clear: both; float: right; border-top-left-radius: 7px; border-bottom-right-radius: 7px; border-bottom-left-radius: 12px; height: 30px; line-height: 10px; padding: 10px; margin: 10px;" class="list-group-item"><span style="float: right; line-height: 10px">'+$scope.receiverHistory.message+'</span></li>');
				}
			}
			if(array[i].genre=="image")
			{
				if(array[i].status=="send")
				{
					$('#chatList').append('<li style="background-color: #ECECEC; clear: both; width: 100%; height: 180px; margin-top: 10px; margin-bottom: 10px; margin-left: 10px"><img src="'+$scope.receiverHistory.file+'" class="popUpActivator" style="margin: 10px; float: left; width: 150px; height: 180px; border: 2px solid #3B5998"/></li>');
				}
				else
				{
					$('#chatList').append('<li style="background-color: #ECECEC; clear: both; width: 100%; height: 180px; margin-top: 10px; margin-bottom: 10px; margin-right: 10px"><img src="'+$scope.receiverHistory.file+'" class="popUpActivator" style="margin: 10px; float: right; width: 150px; height: 180px; border: 2px solid white"/></li>');	
				}
			}
			if(array[i].genre=="file")
			{

				thumbnail(array[i].file,"chatList",array[i].status);
				
			}
		}
	};

	//function to socket a message to server
	$scope.sendMessage = function(){
		if($scope.msg!='')
		{
			socket.emit('send private message',{from: $scope.username, to:$scope.chatWith.username, message:$scope.msg});
			$scope.messages[$scope.chatWith.username].push({author: 'Me', message: $scope.msg, genre: 'message', status: 'send'});
			$('#chatList').append('<li style="float: left; clear: both; border-top-right-radius: 7px; border-bottom-right-radius: 7px; border-bottom-left-radius: 12px; height: 30px; line-height: 10px; padding: 10px; margin: 10px;" class="list-group-item"><span style="float: left; line-height: 10px">'+$scope.msg+'</span></li>');
			$scope.msg='';
		}
	};

	//function sockets pdf to server
	$scope.emitPDF = function(url){
		socket.emit('send pdf',{from: $scope.username, to:$scope.chatWith.username, file: url});
		$scope.messages[$scope.chatWith.username].push({author: 'Me', file: url, genre: 'file', status: 'send'});
	};

	//function sockets an image to server
	$scope.emitImage = function(url){
		socket.emit('send image',{from: $scope.username, to:$scope.chatWith.username, file: url});
		$scope.messages[$scope.chatWith.username].push({author: 'Me', file: url, genre: 'image', status: 'send'});
	};

	//listens for messages emit by server
	socket.on('receive private message',function(data){
		$scope.messages[data.from].push({author: data.from, message: data.message, genre: 'message', status: 'receive'});
		$scope.messageHistory={author: data.from, message: data.message, genre: 'message', status: 'receive'};
		if($scope.chatWith.username==data.from)
		{
			if(data.message!='')
			$('#chatList').append('<li style="float: right; clear: both; border-top-left-radius: 7px; border-bottom-right-radius: 7px; border-bottom-left-radius: 12px; height: 30px; line-height: 10px; padding: 10px; margin: 10px;" class="list-group-item"><span style="float: right; line-height: 10px">'+data.message+'</span></li>');
		}
		else
			$scope.badgeCounter[data.from]+=1;
		$scope.$apply();
	});

	//listens for pdf emit by server
	socket.on('receive pdf',function(data){
		$scope.messages[data.from].push({author: data.from, file: data.file, genre: 'file', status: 'receive'});
		if($scope.chatWith.username==data.from)
		{
			thumbnail(data.file,"chatList","receive");
		}
		else
			$scope.badgeCounter[data.from]+=1;
		$scope.$apply();
	});

	//listens for images emit by server
	socket.on('receive image',function(data){
		$scope.imageHistory={author: data.from, file: data.file, genre: 'image', status: 'receive'};
		if($scope.chatWith.username==data.from)
		{
			$('#chatList').append('<li style="background-color: #ECECEC; clear: both; width: 100%; height: 180px; margin-top: 10px; margin-bottom: 10px; margin-right: 10px"><img src="'+data.file+'" class="popUpActivator" style="float: right; width: 150px; height: 180px; border: 2px solid white; margin: 10px"/></li>');
		}
		else
			$scope.badgeCounter[data.from]+=1;
		$scope.messages[data.from].push($scope.imageHistory);
		$scope.$apply();
	});

	//sockets login request to server
	$scope.login = function(){
		socket.emit('register',{username : $scope.username});
	};

	// listens for successful validation from server
	socket.on('username exists',function(data){
		$scope.showError=true;
		$scope.error=data.msg;
		$scope.$apply();
	});

	//listens for online users response from server 
	socket.on('populateOnline',function(data){
		$scope.online= true;
		$('#modal').modal('hide');
		$scope.users = data.users;
		for(var i in $scope.users)
		{
			if(!$scope.users.hasOwnProperty(i))
			{
				continue;
			}	
			else
			{
				$scope.messages[i]=[];
				$scope.badgeCounter[i]=0;
			}
		}
		
		$scope.$apply();
	});

	//listens for new user online
	socket.on('updateUser',function(data){
		$scope.users[data.username]={username: data.username, socketId: data.socketId};
		$scope.messages[data.username]=[];
		$scope.badgeCounter[data.username]=0;
		$scope.$apply(); 
	});

	
	//listens for a user going offline
	socket.on('removeUser',function(data){
		var username = data.username;
		delete $scope.users[username];
		if($scope.chatWith.username==data.username)
		{
			$scope.interact=true;
			$scope.chatWith={};
		}
		$scope.$apply();
	});

	
	
});
