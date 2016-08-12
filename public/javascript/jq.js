$(document).ready(function(){
	$('#newBoardButton').click(function(){
		$('#addBoardModal').modal('hide');
	});
	
	$('#newListButton').on('click',function(){
		$('#addCardModal').modal('hide');
	});
	
});

