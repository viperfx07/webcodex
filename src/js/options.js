/**
 * Requirements:
 * 1. Multiple options to add more URLs & configuration
 *     a. Jira
 *     b. Kentico
 *     c. Bugherd
 *     d. Asana
 * 2. Shortcuts
 * 3. Alfred/Zeplin-like shortcut
 */

var optionsCache = [];

function save_options(opt) {
    optionsCache.push(opt);
    chrome.storage.sync.set({
        options: optionsCache
    });
}

function restore_items(items){
    console.log(items);
	optionsCache = items;
}

function restore_options() {
    chrome.storage.sync.get({
       options: optionsCache
    }, restore_items);
}

$(function(){
	//load the options when the page is loaded
	restore_options();

	$(".js-add").click(function() {
	    var savedOption = {};
        savedOption = {
            trackerType: $('#trackerType').val(),
            url: $('#url').val()
        };
        save_options(savedOption);
	});
});