// TODO
// (optional) add li:after for complete word, e.g. binv = Bugherd (Inv)

let options, searchList, widget, $gotoany, $widget, $ul;
const fuzzyOpt = { pre: '<b>', post: '</b>' };

const convertOptionsToSearchList = (options) => {
    return options.map((item) => item.trackerType.substring(0,1) + item.project.toLowerCase());
};

const updateList = () => {
    chrome.storage.sync.get('options', (items)=>{
        options = items.options;
        if($ul.length){
            searchList = convertOptionsToSearchList(options);
            let html = searchList.map((item) => '<li class="webcodex-li">' + item + '<li>').join('');
            $ul.html(html);
        }
    });
};

let afterSyncGet = new Promise((resolve, reject) => {
    chrome.storage.sync.get('options', (items)=>{
        resolve(items.options);
    });
});

/////////////
// Initial //
/////////////
afterSyncGet.then((options) => {
    searchList = convertOptionsToSearchList(options);
    let listHtml = '<ul class="webcodex-ul">' + searchList.map( (item) => '<li class="webcodex-li">' + item + '</li>').join('') + '</ul>';

    widget = `
        <style>
            .webcodex-widget{
                display:none;position: fixed;z-index: 99999;top: 10%;left: 50%;width: 100%;transform: translateX(-50%);background: rgba(0, 0, 0, 0.6);margin: auto;max-width: 420px;color: white;padding: 10px;border-radius: 20px;                
            }
            .webcodex-ul{
                padding-left: 20px;
                padding-right: 20px;
                list-style: none;
                margin-top: 10px;
            }
            .webcodex-li{
                font-size: 16px;
                padding: 5px;
            }
            
            .webcodex b{
                color:#fbbc05;
            }

            .webcodex-gotoany{
                box-shadow: 0 1px 5px rgba(0,0,0,.5); 
                width: 100%;
                height: 50px;
                color: inherit;
                background: rgba(0,0,0,0.6);
                border-radius: 20px;
                padding: 0 20px;
                font-size: 16px;
                border: 0;
                box-sizing:border-box;
                outline:0;
            }
        </style>
        <div class="webcodex-widget">
            <input class="webcodex-gotoany" placeholder="" style="" aria-hidden="hidden">
            ${listHtml}
        </div>
    `;
    $('body').append(widget);
    $widget = $('.webcodex-widget');
    $gotoany = $('.webcodex-gotoany');
    $ul = $('.webcodex-ul');
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
    let response = {};
    let cmd = request.command;
    if (cmd == "copytitle") {
        // JIRA
        if($('#key-val').length || $('#issuekey-val').length){
            response.text = '[' + $('#key-val, #issuekey-val').text() + '] ' + $('#summary-val').text().substring(0, 140);
        }
        // Bugherd
        else if($('.taskDetailId').length) {
            response.text = '[BH-' + $('.taskDetailId').text() + '] ' + $('.taskDescriptionHolder').text().substring(0, 140);
        }
        callback(response);
    } else if (cmd == "gotoissue") {
        response.issueNumber = prompt('Enter issue number:');
        if (typeof response.issueNumber !== 'undefined' && response.issueNumber.length > 0) {
            callback(response);
        }
    } else if (cmd == "go-to-any"){
        $widget.toggle();
        $gotoany
            .focus()
            .off('keyup').keyup(function(e){
                let $this = $(this);
                e.preventDefault();
                if(e.which === 13){
                    response.text = $this.val();
                    chrome.runtime.sendMessage({type:'go-to-any', text: $(this).val()});
                    // hide it
                    $(this).val('').parent().hide();
                }else{
                    let html;
                    if($this.val().length){
                        let results = fuzzy.filter($this.val(), searchList, fuzzyOpt);
                        html = results.map((item) => '<li class="webcodex-li">' + item.string + '<li>').join('');
                    } else{
                        html = searchList.map( (item) => '<li class="webcodex-li">' + item + '</li>').join('');
                    }
                    $ul.html(html);
                }
            })
            .off('keydown').keydown(function(e){
                let $this = $(this);
                if(e.which === 9){
                    e.preventDefault();
                    $this.val($('li:first-child', $ul).text());
                } 
            })
            .off('focusout').on('focusout', function(e){
                $(this).val('').parent().hide();
            });
    }
    else if (cmd == "updatelist") {
        updateList();
    }
    else if (cmd == "refreshissuetable") { //jira only
        document.querySelector('.refresh-table').dispatchEvent(new Event('click'));
    }
});
