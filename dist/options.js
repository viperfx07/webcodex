// @codekit-prepend "jquery.easing.1.3.js";
// @codekit-prepend "velocity.min.js";
// @codekit-prepend "hammer.min.js";
// @codekit-prepend "jquery.hammer.js";
// @codekit-prepend "collapsible.js";
// @codekit-prepend "dropdown.js";
// @codekit-prepend "leanModal.js";
// @codekit-prepend "materialbox.js";
// @codekit-prepend "parallax.js";
// @codekit-prepend "tabs.js";
// @codekit-prepend "tooltip.js";
// @codekit-prepend "waves.js";
// @codekit-prepend "toasts.js";
// @codekit-prepend "sideNav.js";
// @codekit-prepend "scrollspy.js";
// @codekit-prepend "forms.js";
// @codekit-prepend "slider.js";
// @codekit-prepend "date_picker/picker.js";
// @codekit-prepend "date_picker/picker.date.js";
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

let optionsCache = [];

function save_options(opt) {
    optionsCache.push(opt);
    chrome.storage.sync.set({
        options: optionsCache
    });
    restore_options();
}

function restore_items(items){
	optionsCache = $.isArray(items.options) ? items.options : [];
    let strHtml = '';
    for(item of optionsCache){
       strHtml += `<option value="${item.url}">${item.url} [${item.trackerType}]</option>`;
    }
    $('#chosen').html(strHtml);
}

function clearAll(){
    chrome.storage.sync.set({options:[]}, function(){
        restore_options();    
    });
    
}

function restore_options() {
    chrome.storage.sync.get('options', restore_items);
}

//load the options when the page is loaded
restore_options();

$("form").submit((e) => {
    e.preventDefault();
    let savedOption = {};
    savedOption = {
        trackerType: $('#trackerType').val(),
        url: $('#url').val()
    };
    console.log(savedOption);
    save_options(savedOption);
    return false;
});

$('.js-clear-all').click(() => {
    clearAll();
});

$('#trackerType').change(function() {
    $(this).closest('.input-group').attr('data-tracker-input', $(this).val());
});

