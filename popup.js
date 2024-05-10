showLatestTranscript()

document.getElementById('start').addEventListener('click', async function() {
    while (true) {
        const tab = await getCurrentTab();
        if (tab) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            })
            break;
        }
    }
})

document.getElementById('stop').addEventListener('click', async () => {

    while (true) {
        const tab = await getCurrentTab();
        if (tab) {
            chrome.tabs.sendMessage(tab.id, { message: 'stop' })
            break;
        }
    }
})

document.getElementById('clear').addEventListener('click', async () => {
    chrome.storage.local.remove(['transcript'])
    document.getElementById('transcript').innerHTML = ''
})

chrome.runtime.onMessage.addListener(({ message }) => {
    if(message == 'transcriptavailable') {
        showLatestTranscript()
    }
})

function showLatestTranscript() {
    chrome.storage.local.get("transcript", ({ transcript }) => {
        document.getElementById('transcript').innerHTML = transcript
    })
}

async function getCurrentTab() {
    const queryOptions = { active: true, lastFocusedWindow: true }
    const [tab] = await chrome.tabs.query(queryOptions)
    return tab
}
