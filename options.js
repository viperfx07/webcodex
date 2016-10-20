function save_options() {
    chrome.storage.sync.set({
        jiraUrl: $("#jiraUrl").val(),
        projectName: $("#projectName").val()
    });
}

function restore_items(items){
	$("#jiraUrl").val(items.jiraUrl);
	$("#projectName").val(items.projectName);
}

function restore_options() {
    chrome.storage.sync.get({
        jiraUrl: "https://ljhooker.atlassian.com",
        projectName: "WEBCMS",
    }, restore_items);
}

$(function(){
	//load the options when the page is loaded
	restore_options();

	$(".jira-options").keyup(function() {
	    save_options();
	});
});