chrome.runtime.onMessage.addListener((request, sender, callback) => {
    let response = {};
    if (request.command == "copytitle") {
        // JIRA
        if($('#key-val').length || $('#issuekey-val').length){
            response.text = '[' + $('#key-val, #issuekey-val').text() + '] ' + $('#summary-val').text().substring(0, 140);
        }
        // Bugherd
        else if($('.taskDetailId').length) {
            console.log($('.taskDescriptionHolder').text().substring(0, 140));
            response.text = '[' + $('.project-name').contents().last().text().trim() + '-' + $('.taskDetailId').text() + '] ' + $('.taskDescriptionHolder').text().substring(0, 140);
        }
        callback(response);
    } else if (request.command == "gotoissue") {
        response.issueNumber = prompt('Enter issue number:');
        if (typeof response.issueNumber !== 'undefined' && response.issueNumber.length > 0) {
            callback(response);
        }
    } else if (request.command == "refreshissuetable") {
        document.querySelector('.refresh-table').dispatchEvent(new Event('click'));
    }
});
