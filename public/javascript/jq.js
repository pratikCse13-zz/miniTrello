$(document).ready(function(){
	
	$('#modal').modal('show');

	$('#modal').modal({
		backdrop: 'static'
		
	});

    $(document).on('click','.popUpActivator',function(){
        $('#previewHere').html('');
        $('#previewHere').append('<img src="'+$(this).attr('src')+'" style="width: 560px; height: 730px;"/>');
        $('#popUp').modal('show');
    });


	function thumbnail(pdfURL, elementID, style) {
    	PDFJS.workerSrc = '/javascript/pdf.worker.js';
    	PDFJS.getDocument(pdfURL).then(function (pdf){
        	pdf.getPage(1).then(function (page) {  
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
                $("#" + elementID).append('<li style="background-color: #ECECEC; clear: both; width: 100%; margin: 10px"><img src="' + img + '" class="popUpActivator" style="margin: 10px; float: left; width: 150px; height: 180px; border: 2px solid #3B5998"/></li>');
            	if(style=="receive")
            	$("#" + elementID).append('<li style="background-color: #ECECEC; clear: both; width: 100%; margin: 10px; margin-right: 20px"><img src="' + img + '" class="popUpActivator" style="margin: 10px; float: right; width: 150px; height: 180px; border: 2px solid white"/></li>');	
            });
        });
    });
    }
        
    var width;
    $('ul li span').each(function() {
            width = $(this).css('width');
            $(this).parent('li').css('width', width);
        });

	
	$('#pdfActivator').on('click',function(){
			$('#pdfUpload').trigger('click');
	   });

   
   	$('#pdfUpload').on('change', function(e){
   		console.log("change caught");
		var file = e.originalEvent.target.files[0];
        reader = new FileReader();
		reader.onload = function(evt){
    	thumbnail(evt.target.result,"chatList","send");
        angular.element('#body').scope().emitPDF(evt.target.result);
		angular.element('#body').scope().$apply();
        };
    	reader.readAsDataURL(file);
        $('#pdfUpload').val=null;  
	   });

	$('#imageActivator').on('click',function(){
		$('#imageUpload').trigger('click');
		});

	$('#imageUpload').on('change', function(e){
    	console.log("change caught");
		var file = e.originalEvent.target.files[0],
       	reader = new FileReader();
		reader.onload = function(evt){
    		$("#chatList").append('<li style="background-color: #ECECEC; clear: both; width: 100%; height: 180px; margin-top: 5px; margin-bottom: 5px; margin-left: 10px"><img src="' + evt.target.result + '" class="popUpActivator" style="margin: 10px; float: left; width: 150px; height: 180px; border: 2px solid #3B5998"/></li>');
  	     	angular.element('#body').scope().emitImage(evt.target.result);
  	     	angular.element('#body').scope().$apply();
    	};
    	   reader.readAsDataURL(file);
            $('#imageUpload').val=null;  
		});		
        });
	


