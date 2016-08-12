var app = angular.module('app',['ngRoute','dndLists']);

app.config(function($routeProvider){
		$routeProvider
			.when('/boards',{
				templateUrl: '/views/boards.html',
				controller: 'boardCtrl'
			})
			.when('/lists',{
				templateUrl: '/views/lists.html',
				controller: 'listCtrl' 
			})
			.otherwise({
				redirectTo: '/boards'
			});
});

app.controller('boardCtrl',function($scope,$http,$rootScope){

		$rootScope.boards=[];
		$rootScope.currentBoard={};
		$scope.newBoard='';
		$scope.addNewBoard = function(){
			if($scope.newBoard!='')
			{
				$http.post('/saveBoard',{boardName: $scope.newBoard}).then(function(res){
						$rootScope.boards.push({name: res.data.name, id: res.data._id});
				});	
			}	
		};

		function getBoards(){
			$http.get('/getBoards').then(function(res){
				var temp =  {};
				for(var i=0;i<res.data.length;i++)
				{
					temp={};
					temp.name=res.data[i].name;
					temp.id=res.data[i]._id; 
					$rootScope.boards.push(temp);
				}
				console.log($rootScope.boards);
			});
		}

		$scope.setCurrentBoard = function(board){
			$rootScope.currentBoard = board;
		};

		getBoards();
	
});

app.controller('listCtrl',function($scope,$http,$rootScope){
		$rootScope.listsWithCards=[];
		$scope.newList='';
		$scope.newCard='';
		$scope.clickedList={};

		/*$rootScope.$watch('listsWithCards',function(newv,old){
			for(var i=0;i<$rootScope.listsWithCards.length;i++)
			{
				for(var j=0;j<$rootScope.listsWithCards[i].cards.length;j++)
				{
					if($rootScope.listsWithCards[i].cards[j].list!=$rootScope.listsWithCards[i].id)
						
				}
			}
		},true);*/

		$scope.dropped = function(e){
			
		};

		$scope.insertedCallback = function(event,index,item,type,external){
				var temp={};
				for(var i=0;i<$rootScope.listsWithCards.length;i++)
				{
					for(var j=0;j<$rootScope.listsWithCards[i].cards.length;j++)
					{
						if($rootScope.listsWithCards[i].cards[j].list!=$rootScope.listsWithCards[i].id)
						{
							$rootScope.listsWithCards[i].cards[j].list=$rootScope.listsWithCards[i].id;
							temp=$rootScope.listsWithCards[i].cards[j];
							i=$rootScope.listsWithCards.length;
							break;
						}
					}
				}
				$http.post('/updateDrop',temp).then(function(res){});
		};
		
		$scope.addNewCard= function(){
			if($scope.newCard!='')
			{
					var temp = {content: $scope.newCard, list: $scope.clickedList.id};
					$http.post('/saveCard',{content: $scope.newCard, listId: $scope.clickedList.id, boardId: $rootScope.currentBoard.id}).then(function(res){
							temp.id=res.data._id;
							for(var i=0;i<$rootScope.listsWithCards.length;i++)
							{
								if($rootScope.listsWithCards[i].id==$scope.clickedList.id)
								{
									$rootScope.listsWithCards[i].cards.push(temp);	
								}	
							}	
					});
					$scope.newCard='';
			}
		};

		$scope.setLinkId = function(list){
			$scope.clickedList=list;
		};

		$scope.addNewList= function(){
			if($scope.newList!='')
			{
					var list = {name: $scope.newList, cards: []};
					$http.post('/saveList',{listName: $scope.newList, boardId: $rootScope.currentBoard.id}).then(function(res){
								list.id=res.data.id;	
								$rootScope.listsWithCards.push(list);
					});
					$scope.newList='';
			}				
		};
			
		function getLists(){
			$http.post('/getLists',{boardId: $rootScope.currentBoard.id}).then(function(res){
				var listsInBoard = res.data;
				$http.post('/getCards',{boardId: $rootScope.currentBoard.id}).then(function(result){
						var cardsInBoard = result.data;
						for(var i=0;i<listsInBoard.length;i++)
						{
							var temp = {};
							temp.id=listsInBoard[i]._id;
							temp.name=listsInBoard[i].name;
							var cards = [];
							for(var j=0;j<cardsInBoard.length;j++)
							{
								if(cardsInBoard[j].list==listsInBoard[i]._id)
								{
									cards.push({content: cardsInBoard[j].content, id: cardsInBoard[j]._id, list: cardsInBoard[j].list});
								}
							}
							temp.cards=cards;
							$rootScope.listsWithCards.push(temp);
						}
				});
			});
		}

		getLists();
				
});
