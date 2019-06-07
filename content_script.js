/**
 * Add Harvest Dialog on Bugherd
 *
 */
;(function() {
    if (window.location.href.includes('bugherd')) {
        const timerLi = document.createElement('li')
        timerLi.className = 'miniButton'
        timerLi.innerHTML = `<button id="timerbtn" type="button" tabIndex="-1" style="display: inline-flex; align-items: center; justify-content: center; background: none;"><svg width="12" height="12" focusable="false" viewBox="0 0 32 32"><path fill="#6f8694" d="M26.6,8.8l2.3-2.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0l-2.3,2.3C22.7,5.3,19.5,4,16,4S9.3,5.3,6.8,7.4L4.6,5.2c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l2.3,2.3c-2.6,3-3.9,7-3.3,11.4c1,6.1,6,11,12.2,11.7C22.8,32.9,30,26.3,30,18C30,14.5,28.7,11.3,26.6,8.8z M16,30C9.4,30,4,24.6,4,18S9.4,6,16,6s12,5.4,12,12S22.6,30,16,30z M13,0h6c0.6,0,1,0.4,1,1l0,0c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1l0,0C12,0.4,12.4,0,13,0z M16,17l5.2-5.2c0.4-0.4,1-0.4,1.4,0l0,0c0.4,0.4,0.4,1,0,1.4l-5.2,5.2c-0.4,0.4-1,0.4-1.4,0l0,0C15.6,18,15.6,17.3,16,17z M16,8c0.6,0,1,0.4,1,1s-0.4,1-1,1c-0.6,0-1-0.4-1-1S15.4,8,16,8z M16,26c0.6,0,1,0.4,1,1s-0.4,1-1,1c-0.6,0-1-0.4-1-1S15.4,26,16,26z M9.6,10.6c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S9,10.6,9.6,10.6z M22.4,23.4c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S21.8,23.4,22.4,23.4z M7,17c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S6.4,17,7,17z M25,17c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S24.4,17,25,17z M9.6,23.4c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S9,23.4,9.6,23.4z"></path></svg></button>`

        const timerDialog = document.createElement('dialog')
        timerDialog.style.padding = 0
        timerDialog.style.border = 0
        timerDialog.style.minWidth = '500px'

        const parent = document.querySelector('.panelHead .panelHeadActions')
        parent.insertBefore(timerLi, parent.lastChild)
        document.body.append(timerDialog)

        window.addEventListener('message', ev => {
            if (ev.data && ev.data.type) {
                switch (ev.data.type) {
                    case 'frame:close':
                        timerDialog.close()
                        break
                    case 'frame:resize':
                        timerDialog.querySelector('iframe').style.height = `${
                            ev.data.value
                        }px`
                        break
                }
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
            const url =
                document.location.origin +
                encodeURIComponent(
                    document.location.pathname + document.location.search
                )

            // just make it unique, so it won't have impression of incorrect tracked time
            const external_item_id = Math.round(new Date())

            timerDialog.innerHTML = `<iframe width="100%" frameborder="0" id="harvest-iframe" src="https://platform.harvestapp.com/platform/timer?app_name=Bugherd&amp;service=bugherd.com&amp;permalink=${url}&amp;external_item_id=${external_item_id}&amp;external_item_name=${`[BH-${bhTaskDetailId}] - ${taskDescription}`}" style="height: 383px; transition: .2s;"></iframe>`
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
