// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.yy

var options = [];

chrome.storage.sync.get('options', function(item){
  options = item.options;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    options[key] = storageChange.newValue;
  }
});

function sendCommandToActiveTab(commandStr, callbackFunction){
  chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: commandStr} , callbackFunction);
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
          title:"[WEBCODEX] Title Copied!", 
          iconUrl: "icon.png",
          message: response.text});
    }
  };
  sendCommandToActiveTab("copytitle", callback);
}

function goToIssue(){
  var callback = function(response){
    if(response) {
      var issueNumber = response.issueNumber;
      var jiraUrl = options['jiraUrl'];
      var projectName = options['projectName'];
      console.log(options);
      console.log(jiraUrl);
      var issueUrl = jiraUrl + "/browse/" + projectName + '-' + issueNumber;
      chrome.tabs.create({url: issueUrl})
    }
  };

  sendCommandToActiveTab("gotoissue", callback);
}

function refreshIssueTable(){
  sendCommandToActiveTab('refreshissuetable', function(response){ console.log(response); });
}

chrome.commands.onCommand.addListener(function(command){
  switch(command){
    case 'copy-title-to-clipboard': copyTitleToClipboard(); break;
    case 'go-to-issue': goToIssue(); break;
    case 'refresh-issue-table': refreshIssueTable(); break;
  }
});

// Create one test item for each context type.
chrome.contextMenus.create({
    "title": "Copy title to clipboard",
    "contexts": ["page"],
    "onclick": copyTitleToClipboard
});
