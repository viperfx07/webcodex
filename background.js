// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.yy

function sendCommandToActiveTab(
    commandStr,
    isActiveOnly = true,
    callbackFunction,
    params
) {
    let opt = isActiveOnly ? { active: true, currentWindow: true } : {}
    chrome.tabs.query(opt, function(tabs) {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(
                tab.id,
                {
                    command: commandStr,
                    params
                },
                callbackFunction
            )
        })
    })
}

// A generic onclick callback function.
function copyTitleToClipboard(params) {
    var callback = function(response) {
        if (response) {
            chrome.notifications.create({
                type: 'basic',
                title: '[WEBCODEX] Title Copied!',
                iconUrl: 'icon.png',
                message: response.text
            })
        }
    }
    sendCommandToActiveTab('copy-title-to-clipboard', true, callback, params)
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
    id: 'copyTitleToClipboard',
    title: 'Copy title to clipboard',
    contexts: ['page', 'link'],
    // onclick: copyTitleToClipboard
})

chrome.contextMenus.onClicked.addListener(copyTitleToClipboard)