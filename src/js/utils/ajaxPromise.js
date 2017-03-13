export function ajaxUtility(params){
	var promiseObject = new Promise(function(resolve){
		var request = new XMLHttpRequest();
	    request.open('GET',params);
    	request.onload = function() {
      		if (request.status == 200) {
            var response = JSON.parse(request.response);
        		resolve(response); 
      		}
    	};
	    request.onerror = function() {
    	  console.log('Error fetching data.'); 
    	};
      request.setRequestHeader("Accept","application/json");
      request.setRequestHeader("Content-Type","application/json");
    	request.send(); 
	});
	return promiseObject;
}