$('body').append('<input class="webcodex-gotoany" placeholder="" style="display:none; box-shadow: 0 1px 5px rgba(0,0,0,.5); position: fixed; z-index: 99999;top: 10%;left: 50%;width: 100%;height: 50px;color: white;background: rgba(0,0,0,0.6);margin: auto;transform: translateX(-50%);border-radius: 20px;max-width: 420px;padding: 0 20px;font-size: 16px;border: 0;outline:0" aria-hidden="hidden">');

let $gotoany = $('.webcodex-gotoany');
let goToAnyCallback;
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    let response = {};
    console.log(callback);
    if (request.command == "copytitle") {
        // JIRA
        if($('#key-val').length || $('#issuekey-val').length){
            response.text = '[' + $('#key-val, #issuekey-val').text() + '] ' + $('#summary-val').text().substring(0, 140);
        }
        // Bugherd
        else if($('.taskDetailId').length) {
            response.text = '[' + $('.project-name').contents().last().text().trim() + '-' + $('.taskDetailId').text() + '] ' + $('.taskDescriptionHolder').text().substring(0, 140);
        }
        callback(response);
    } else if (request.command == "gotoissue") {
        response.issueNumber = prompt('Enter issue number:');
        if (typeof response.issueNumber !== 'undefined' && response.issueNumber.length > 0) {
            callback(response);
        }
    } 
    else if (request.command == "go-to-any"){
        $gotoany
            .toggle()
            .focus()
            .off('keyup')
            .keyup(function(e){
                let $this = $(this);
                e.preventDefault();
                if(e.which === 13){
                    response.text = $this.val();
                    chrome.runtime.sendMessage({type:'go-to-any', text: $(this).val()});
                    // hide it
                    $(this).hide().val('');
                }
            });
    }
    else if (request.command == "refreshissuetable") { //jira only
        document.querySelector('.refresh-table').dispatchEvent(new Event('click'));
    }
});
