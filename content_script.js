chrome.runtime.onMessage.addListener((request, sender, callback) => {
    let response = {}
    const { command: cmd, params } = request

    console.log(params)

    if (cmd == 'copy-title-to-clipboard') {
        const $jiraKeyVal =
            document.querySelector('#key-val') ||
            document.querySelector('#issuekey-val')

        const $bhTaskDetailId = document.querySelector(
            '#detailBar a[href*="/tasks/"]'
        )
        const freshdeskTitle = document.title

        const azureDevopsWorkItemID = document.querySelector('a.caption')

        const azureDevopsWorkItemPossibleLink =
            params && params.linkUrl
                ? params.linkUrl.split('visualstudio.com')
                : ''

        // JIRA
        if ($jiraKeyVal) {
            const $summaryVal = document.querySelector('#summary-val')
            response.text = `[ ${$jiraKeyVal.innerText.trim()} ] ${$summaryVal.innerText
                .trim()
                .substring(0, 140)}`
        }
        // Bugherd
        else if ($bhTaskDetailId) {
            const $taskDescriptionHolder = document.querySelector(
                '#task_details_container > div > div:nth-child(2) > div > div > div > span'
            )
            response.text = `[BH-${$bhTaskDetailId.innerText
                .replace('Task #', '')
                .trim()}] ${$taskDescriptionHolder.innerHTML
                .trim()
                .substring(0, 140)}`
        }
        // Freshdesk
        else if (new RegExp('^\\[#[0-9]+\\]').test(freshdeskTitle)) {
            const _freshdeskTitle = freshdeskTitle
                .replace('#', 'FD-')
                .replace(': Webcoda', '')
                .trim()
            response.text = _freshdeskTitle.substring(0, 140)
        }
        // Azure Devops (page)
        else if (azureDevopsWorkItemID) {
            const id = azureDevopsWorkItemID.innerText.match(/\d+/)[0]
            const title = document.querySelector('[aria-label="Title Field"]')
            response.text = `[WorkItem #${id}] ${title.value}`
        }
        // Azure Devops Context Menu on Link
        else if (azureDevopsWorkItemPossibleLink) {
            const link = azureDevopsWorkItemPossibleLink[1]
            const $link = document.querySelector(`a[href*="${link}"]`)
            if (!$link) return
            const id = link.match(/\d+/)[0]
            const title = $link.innerText
            response.text = `[WorkItem #${id}] ${title}`
        }
        callback(response)
    } else if (cmd == 'gotoissue') {
        response.issueNumber = prompt('Enter issue number:')
        if (
            typeof response.issueNumber !== 'undefined' &&
            response.issueNumber.length > 0
        ) {
            callback(response)
        }
    } else if (cmd == 'refreshissuetable') {
        //jira only
        document
            .querySelector('.refresh-table')
            .dispatchEvent(new Event('click'))
    }
})
