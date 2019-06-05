/**
 * Add Harvest Dialog on Bugherd
 *
 */
;(function() {
    if (window.location.href.includes('bugherd')) {
        const timerLi = document.createElement('li')
        timerLi.className = 'miniButton'
        timerLi.innerHTML = `<button id="timerbtn" type="button" tabIndex="-1">T</button>`

        const timerDialog = document.createElement('dialog')
        timerDialog.style.padding = 0
        timerDialog.style.border = 0
        timerDialog.style.minWidth = '500px'

        const parent = document.querySelector('.panelHeadActions')
        parent.insertBefore(timerLi, parent.firstChild)
        document.body.append(timerDialog)

        window.addEventListener('message', ev => {
            if (ev.data && ev.data.type == 'frame:close') {
                timerDialog.close()
            }
        })

        timerLi.querySelector('#timerbtn').addEventListener('click', () => {
            const $bhTaskDetailId = document.querySelector('.taskDetailId')
            const $taskDescriptionHolder = document.querySelector(
                '.taskDescriptionHolder'
            )

            const bhTaskDetailId = $bhTaskDetailId.innerText.trim()
            const taskDescription = $taskDescriptionHolder.innerText
                .trim()
                .substring(0, 140)
            const url = document.location.href

            timerDialog.innerHTML = `<iframe width="100%" frameborder="0" id="harvest-iframe" src="https://platform.harvestapp.com/platform/timer?app_name=Bugherd&amp;service=bugherd.com&amp;permalink=${url}&amp;external_item_id=1117565483889023&amp;external_item_name=${`[BH-${bhTaskDetailId}] - ${taskDescription}`}" style="height: 383px;"></iframe>`
            timerDialog.showModal()
        })
    }
})()

chrome.runtime.onMessage.addListener((request, sender, callback) => {
    let response = {}
    let cmd = request.command
    if (cmd == 'copy-title-to-clipboard') {
        const $jiraKeyVal =
            document.querySelector('#key-val') ||
            document.querySelector('#issuekey-val')

        const $bhTaskDetailId = document.querySelector('.taskDetailId')

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
                '.taskDescriptionHolder'
            )
            response.text = `[ BH-${$bhTaskDetailId.innerText.trim()} ] ${$taskDescriptionHolder.innerText
                .trim()
                .substring(0, 140)}`
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
