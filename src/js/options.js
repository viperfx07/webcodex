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

function restore_items(items) {
    optionsCache = $.isArray(items.options) ? items.options : [];
    let strHtml = '';
    for (item of optionsCache) {
        if(item.trackerType === 'bugherd'){
            strHtml += `<option value="${item.url}">${item.project} [${item.trackerType}]</option>`;
        } else{
            strHtml += `<option value="${item.url}">${item.url} [${item.trackerType}]</option>`;    
        }
        
    }
    $('#chosen').html(strHtml);
}

function clearAll() {
    chrome.storage.sync.set({ options: [] }, function() {
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

    switch($('[data-tracker-input]').data('trackerInput')){
        case 'jira':
            savedOption.project = $('#jiraProject').val();
            break;
        case 'kentico':
            savedOption.project = $('#kenticoProject').val();
            break;
        case 'bugherd':
            savedOption.project = $('#bugherdProject').val();
            savedOption.projectNumber = $('#bugherdProjectNumber').val();
            break;
        case 'asana':
            savedOption.project = $('#asanaProject').val();
            break;
    }

    save_options(savedOption);

    $('#url').focus().val('');
    $('[type="text"]').val('');

    return false;
});

$('.js-clear-all').click(() => {
    clearAll();
});

$('.js-delete').click(() => {
    $('#chosen option').each(function(index, val) {
        if ($(this).is(':selected')) {
            optionsCache.splice(index, 1);
        }
    });

    chrome.storage.sync.set({ options: optionsCache }, restore_options);
});

$('#trackerType').change(function() {
    let $this = $(this);
    let $url = $('#url');
    $this.closest('.input-group').attr('data-tracker-input',$this.val());
    if($('option:selected', $this).val() == 'bugherd'){
        $url.val('https://www.bugherd.com');
        $('#bugherdProject').focus();
    } else{
        $url.focus().val('');
    }
});
