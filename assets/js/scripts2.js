(function(w){
	if(w.document.documentElement.className.indexOf("fonts-loaded") > -1 ){
		return;
	}
	var sofiapro = new w.FontFaceObserver("SpoqaHanSans");
	w.Promise
		.all([sofiapro])
		.then(function(){
			w.document.documentElement.className += "fonts-loaded";
		});
}(this));