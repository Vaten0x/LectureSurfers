showLatestTranscript()

let selectedOption = localStorage.getItem('selectedOption');

if (selectedOption) {
    document.querySelector(`input[value="${selectedOption}"]`).checked = true;
}

function isOptionSelected() {
    return document.querySelector('input[name="audio-option"]:checked') !== null;
}

document.querySelectorAll('input[name="audio-option"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        selectedOption = event.target.value;
        localStorage.setItem('selectedOption', selectedOption);
        console.log("Selected option:", selectedOption);
    });
});

document.getElementById('start-subway').addEventListener('click', async function() {
    if (!isOptionSelected()) {
        alert('Please select an audio option before starting the game.');
    } else {
        console.log('Subway Surfers button clicked');
        
        while (true) {
            const tab = await getCurrentTab();
            if (tab) {
                executeScriptBasedOnOption(tab.id);
                break;
            }
        }
    }
});

document.getElementById('start-minecraft').addEventListener('click', async function() {
    if (!isOptionSelected()) {
        alert('Please select an audio option before starting the game.');
    } else {
        console.log('Minecraft Parkour button clicked');
        
        while (true) {
            const tab = await getCurrentTab();
            if (tab) {
                executeScriptBasedOnOption(tab.id);
                break;
            }
        }
    }
});

// document.getElementById('stop').addEventListener('click', async () => {
//     while (true) {
//         const tab = await getCurrentTab();
//         if (tab) {
//             chrome.tabs.sendMessage(tab.id, { message: 'stop' })
//             break;
//         }
//     }
// })

// document.getElementById('clear').addEventListener('click', async () => {
//     chrome.storage.local.remove(['transcript'])
//     document.getElementById('transcript').innerHTML = ''
// })

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

//Choose which script to execute based on the selected option
function executeScriptBasedOnOption(tabId) {
    let scriptFile = '';

    if (selectedOption === 'chrome-audio') {
        scriptFile = 'content.js';
    } else if (selectedOption === 'mic-audio') {
        scriptFile = 'content-speech.js';
    }

    if (scriptFile) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [scriptFile]
        });
    }
}