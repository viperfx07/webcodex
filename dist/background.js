// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.yy

var options = [];

function sendCommandToActiveTab(commandStr, isActiveOnly=true, callbackFunction) {
    let opt = (isActiveOnly) ? { active:true, currentWindow: true} : {};
    chrome.tabs.query(opt, function(tabs) {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, { command: commandStr }, callbackFunction);    
        })
        
    });
}

// A generic onclick callback function.
function copyTitleToClipboard() {
    var callback = function(response) {
        if (response) {
            var input = document.createElement('textarea');
            document.body.appendChild(input);
            input.value = response.text;
            input.focus();
            input.select();
            document.execCommand('Copy');
            input.remove();
            chrome.notifications.create({
                type: "basic",
                title: "[WEBCODEX] Title Copied!",
                iconUrl: "icon.png",
                message: response.text
            });
        }
    };
    sendCommandToActiveTab("copytitle", true, callback);
}

function goToIssue(res) {
    if (!res) return;

    let url = '';
    // parse the text
    // Format: [first-letter-of-tracker][project][issue-number]
    // Format example: jwebcms123 = Jira WEBCMS-123

    let tracker = res.substring(0, 1);
    let project = res.substring(1);
    let projectName = (project.match(/[a-zA-Z]+/ig)[0]).trim().toLowerCase();
    let issueNumber = (project.match(/\d+/ig)[0]).trim().toLowerCase();
    let domainName = '';
    let option;

    switch (tracker) {
        case 'j':
            option = getOption('jira', projectName);
            if(!option) return;
            if(!option.length) return;
            domainName = option[0].url;
            url = `https://${domainName}/browse/${projectName}-${issueNumber}`;
            break;
        case 'b':
            option = getOption('bugherd', projectName);
            if(!option) return;
            if(!option.length) return;
            domainName = option[0].url;
            let projectNumber = option[0].projectNumber;
            url = `https://www.bugherd.com/projects/${projectNumber}/tasks/${issueNumber}`;
            break;
    }   


    // var issueNumber = response.issueNumber;
    // var jiraUrl = options['jiraUrl'];
    // var projectName = options['projectName'];
    // console.log(options);
    // console.log(jiraUrl);
    // var issueUrl = jiraUrl + "/browse/" + projectName + '-' + issueNumber;

    if (typeof url !== 'undefined' && url !== '') {
        openTab(url);
    }
}

function getOption(trackerType, projectName) {
    return options.filter((item) => {
        return item.trackerType == trackerType && item.project.toLowerCase() == projectName;
    });
}

function openTab(url) {
    chrome.tabs.create({ url: url });
}

function refreshIssueTable() {
    sendCommandToActiveTab('refreshissuetable');
}

/////////////////
// Storage Get //
/////////////////
chrome.storage.sync.get('options', function(item) {
    options = item.options;
});

///////////////////////
// Storage onChanged //
///////////////////////
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('changed');
    for (key in changes) {
        var storageChange = changes[key];
        options[key] = storageChange.newValue;
    }
    sendCommandToActiveTab("updatelist", false);
});

//////////////////////////////
// Storage Message Listener //
//////////////////////////////
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    switch (request.type) {
        case 'go-to-any':
            goToIssue(request.text);
            break;
    }
});

//////////////////////////////
// Storage Command Listener //
//////////////////////////////
chrome.commands.onCommand.addListener(function(command) {
    switch (command) {
        case 'copy-title-to-clipboard':
            copyTitleToClipboard();
            break;
        case 'go-to-any':
            sendCommandToActiveTab("go-to-any");
            break;
        case 'refresh-issue-table':
            refreshIssueTable();
            break;
    }
});

/////////////////////////////////////////////////
// Context Menu                                //
// Create one test item for each context type. //
/////////////////////////////////////////////////
chrome.contextMenus.create({
    "title": "Copy title to clipboard",
    "contexts": ["page"],
    "onclick": copyTitleToClipboard
});
