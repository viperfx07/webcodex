// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.yy

function sendCommandToActiveTab(
    commandStr,
    isActiveOnly = true,
    callbackFunction
) {
    let opt = isActiveOnly ? { active: true, currentWindow: true } : {}
    chrome.tabs.query(opt, function(tabs) {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(
                tab.id,
                { command: commandStr },
                callbackFunction
            )
        })
    })
}

// A generic onclick callback function.
function copyTitleToClipboard() {
    var callback = function(response) {
        if (response) {
            var input = document.createElement('textarea')
            document.body.appendChild(input)
            input.value = response.text
            input.focus()
            input.select()
            document.execCommand('Copy')
            input.remove()
            chrome.notifications.create({
                type: 'basic',
                title: '[WEBCODEX] Title Copied!',
                iconUrl: 'icon.png',
                message: response.text
            })
        }
    }
    sendCommandToActiveTab('copy-title-to-clipboard', true, callback)
}

//////////////////////////////
// Storage Command Listener //
//////////////////////////////
chrome.commands.onCommand.addListener(function(command) {
    switch (command) {
        case 'copy-title-to-clipboard':
            copyTitleToClipboard()
            break
    }
})

/////////////////////////////////////////////////
// Context Menu                                //
// Create one test item for each context type. //
/////////////////////////////////////////////////
chrome.contextMenus.create({
    title: 'Copy title to clipboard',
    contexts: ['page'],
    onclick: copyTitleToClipboard
})
