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
                playRandomVideo(['subway1.mp4', 'subway2.mp4', 'subway3.mp4']); //randomize the gameplays
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
                playRandomVideo([//'minecraft1.mp4', 
                'minecraft2.mp4', 
                //'minecraft3.mp4'
                ]); //randomize the gameplays
                break;
            }
        }
    }
});

let videoPort;

chrome.runtime.onConnect.addListener(port => {
    if (port.name === "videoControl") {
        videoPort = port;
        port.onMessage.addListener(msg => {
            if (msg.action === "playVideo") {
                playVideo(msg.src);
            } else if (msg.action === "stopVideo") {
                stopVideo();
            }
        });
    }
});

function playRandomVideo(videoList) {
    const randomIndex = Math.floor(Math.random() * videoList.length);
    const selectedVideo = videoList[randomIndex];
    playVideo(`resources/${selectedVideo}`);
}

function playVideo(src) {
    const videoElement = document.createElement("video");
    videoElement.id = "backgroundVideo";
    videoElement.src = src;
    videoElement.style.position = "fixed";
    videoElement.style.top = "0";
    videoElement.style.left = "0";
    videoElement.style.width = "100%";
    videoElement.style.height = "100%";
    videoElement.style.zIndex = "9999";
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.controls = true;
    videoElement.loop = true;  // Enable looping

    const transcriptElement = document.getElementById("transcript");

    transcriptElement.style.position = "abosolute";
    transcriptElement.style.top = "0";
    transcriptElement.style.left = "0";
    transcriptElement.style.zIndex = "10000";

    videoElement.addEventListener('loadeddata', () => {
        videoElement.play().catch(error => {
            console.log("Play was prevented: ", error);
            document.addEventListener('click', () => {
                videoElement.play();
            }, { once: true });
        });
    });

    document.body.appendChild(videoElement);
}

function stopVideo() {
    const videoElement = document.getElementById("backgroundVideo");
    if (videoElement) {
        videoElement.pause();
        videoElement.remove();
    }
}

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
    } else if (selectedOption === 'no-audio') {
        //dont execute any script
    }

    if (scriptFile) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [scriptFile]
        });
    }
}