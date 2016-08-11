var app = angular.module('app',[]);

app.controller('boardCtrl',function($scope,$http,$rootScope){

		$rootScope.board='';
		$scope.newBoard='';
		$scope.addnewBoard = function(){
			console.log('calling get for savebOard');
			$http.post('/saveBoard',{boardName: $scope.newBoard}).then(function(res){
					console.log(res);
			});
		};
	
});
