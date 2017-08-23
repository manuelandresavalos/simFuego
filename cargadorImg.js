function preloadimages(arr){
	var newimages=[], loadedimages=0
	var postaction=function(){}
	var arr=(typeof arr!="object")? [arr] : arr
	function imageloadpost(){
		loadedimages++
		if (loadedimages==arr.length){
			postaction(newimages) //call postaction and pass in newimages array as parameter
		}
	}
	for (var i=0; i<arr.length; i++){
		newimages[i]=new Image()
		newimages[i].src=arr[i]
		newimages[i].onload=function(){
			imageloadpost()
		}
		newimages[i].onerror=function(){
			imageloadpost()
		}
	}
	return { //return blank object with done() method
		done:function(f){
			postaction=f || postaction //remember user defined callback functions to be called when images load
		}
	}
}