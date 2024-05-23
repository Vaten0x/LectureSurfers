showLatestTranscript()

let selectedOption = localStorage.getItem('selectedOption');

window.onload = function() {
    // Check if a game is being shared
    if (localStorage.getItem("beingShared") === "true") {
        // Retrieve the game type from localStorage
        let game = localStorage.getItem("game");
        // Play the appropriate video based on the game type
        if (game === "subway") {
            playRandomVideo(['subway1.mp4', 
            'subway2.mp4', 
            'subway3.mp4'
            ]); //randomize the gameplays
        } else if (game === "minecraft") {
            playRandomVideo(['minecraft1.mp4', 
            'minecraft2.mp4', 
            'minecraft3.mp4'
            ]); //randomize the gameplays
        } else {
            console.log("Game not found");
        }

        // Alert the user that the game is already being shared
        //alert("Game is already being shared. Please click on the 'Stop' button to stop the game.");
    }

    // Retrieve the selected audio option from localStorage
    let selectedOption = localStorage.getItem('selectedOption');
    if (selectedOption) {
        // Check the corresponding radio button
        document.querySelector(`input[value="${selectedOption}"]`).checked = true;
    }
};

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
    } else if (localStorage.getItem("beingShared") == null || localStorage.getItem("beingShared") == "false") {
        console.log('Subway Surfers button clicked');
        
        while (true) {
            const tab = await getCurrentTab();
            if (tab) {
                executeScriptBasedOnOption(tab.id);
                playRandomVideo(['subway1.mp4', 
                'subway2.mp4', 
                'subway3.mp4'
                ]); //randomize the gameplays
                localStorage.setItem("beingShared", "true");
                localStorage.setItem("game", "subway");
                break;
            }
        }
    } else {
        playRandomVideo([
        'subway1.mp4', 
        //'subway2.mp4', 
        //'subway3.mp4'
        ]); //randomize the gameplays

        //print the localStorage value
        console.log(localStorage.getItem("beingShared"));
    }
});

// Ensure to clear socket on tab close
chrome.tabs.onRemoved.addListener(() => {
    //empty the transcript
    chrome.storage.local.set({ transcript: '' });

    //clear the localStorage, so that another option can be chosen again!
    localStorage.clear();
});

document.getElementById('start-minecraft').addEventListener('click', async function() {
    if (!isOptionSelected()) {
        alert('Please select an audio option before starting the game.');
    } else if (localStorage.getItem("beingShared") == null || localStorage.getItem("beingShared") == "false") {
        console.log('Minecraft Parkour button clicked');
        
        while (true) {
            const tab = await getCurrentTab();
            if (tab) {
                executeScriptBasedOnOption(tab.id);
                playRandomVideo([
                //'minecraft1.mp4', 
                'minecraft2.mp4', 
                //'minecraft3.mp4'
                ]); //randomize the gameplays
                localStorage.setItem("beingShared", "true");
                localStorage.setItem("game", "minecraft");
                break;
            }
        }
    } else {
        playRandomVideo(['minecraft1.mp4', 
        'minecraft2.mp4', 
        'minecraft3.mp4'
        ]); //randomize the gameplays

        //print the localStorage value
        console.log(localStorage.getItem("beingShared"));
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

let transcriptLoaded = false;

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

    if (!transcriptLoaded && transcriptElement) {
        chrome.storage.local.get("transcript", ({ transcript }) => {
            transcriptElement.innerHTML = transcript;
            transcriptElement.style.display = "block";  // Make transcript visible
            transcriptElement.style.top = "0";
            transcriptElement.style.left = "0";
            transcriptElement.style.zIndex = "10000";
            transcriptElement.style.fontFamily = "Myriad pro Semibold";
            transcriptElement.style.fontSize = "15px";
            transcriptElement.style.color = "white";
            transcriptLoaded = true;  // Set the flag to true after loading
        });
    } else {
        transcriptElement.style.display = (transcriptElement.style.display === "none") ? "block" : "none";
    }

    const stopButton = document.createElement("button");
    stopButton.innerHTML = "Stop";
    stopButton.style.position = "absolute";
    stopButton.style.top = "5px";
    stopButton.style.left = "5px";
    stopButton.style.zIndex = "10000";  // Higher zIndex than the video
    stopButton.style.display = "block";
    stopButton.style.border = "none";
    stopButton.style.padding = "6px";
    stopButton.style.fontSize = "12px";
    stopButton.style.fontFamily = "Myriad pro Semibold";
    stopButton.onclick = () => {
        stopVideo();
        stopButton.remove();
        stopTranscript();
        localStorage.setItem("beingShared", "false");
        transcriptLoaded = false;
        chrome.runtime.reload()
    };

    videoElement.addEventListener('loadeddata', () => {
        videoElement.play().catch(error => {
            console.log("Play was prevented: ", error);
            document.addEventListener('click', () => {
                videoElement.play();
            }, { once: true });
        });
    });

    document.body.appendChild(videoElement);
    document.body.appendChild(stopButton);
}

function stopVideo() {
    const videoElement = document.getElementById("backgroundVideo");
    if (videoElement) {
        videoElement.pause();
        videoElement.remove();
    }
}

function stopTranscript() {
    const transcriptElement = document.getElementById("transcript");
    if (transcriptElement) {
        transcriptElement.remove();
    }
}

// externalPort.onDisconnect.addListener(function() {
//     console.log("onDisconnect");
//     stopVideo();
//     stopTranscript();
// });

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
    if (message == 'transcriptavailable') {
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
        //clear transcript
        chrome.storage.local.set({ transcript: '' });
    }

    if (scriptFile) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [scriptFile]
        });
    }
}