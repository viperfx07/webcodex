chrome.runtime.onMessage.addListener(
function(request, sender, callback) {
	var response = {};
    if (request.command == "copytitle") {
    	response.type = "copy";
    	response.text = '[' + $('#key-val, #issuekey-val, .taskDetailId').text() + '] ' + $('#summary-val, .taskDescriptionHolder').text();
        callback(response);
    } else if(request.command == "gotoissue"){
    	response.type = "goto";
    	response.issueNumber = prompt('Enter issue number:');
    	if(typeof response.issueNumber !== 'undefined' && response.issueNumber.length>0)
        	callback(response);
    } else if(request.command == "refreshissuetable"){
        response.type = "refresh";
        document.querySelector('.refresh-table').dispatchEvent(new Event('click'));
    }
});