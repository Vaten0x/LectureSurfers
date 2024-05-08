/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
chrome.action.onClicked.addListener(function () {
  chrome.windows.create({
    focused: true,
    width: 600,
    height: 1200,
    type: "popup",
    url: "popup.html",
    top: 0,
    left: 0
  });
  // chrome.tabs.create({url: 'popup.html'});
});

//When the screen sharing is started with shared audio, now capture the audio data real time

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startAudioCapture') {
      startAudioCapture();
  }
});

let audioStream = null;
let audioRecorder = null;

async function startAudioCapture() {
  try {
      audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
      });
      audioRecorder = new MediaRecorder(audioStream);
      audioRecorder.ondataavailable = async event => {
          const audioBlob = event.data;
          const transcript = await transcribeAudio(audioBlob);
          if (transcript) {
              // Send the transcript to the content script
              chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                  chrome.tabs.sendMessage(tabs[0].id, { action: 'transcript', transcript });
              });
          }
      }
      audioRecorder.start();
  } catch (error) {
      console.error('Error starting audio capture:', error);
  }
}

//Transcribe the audio data
async function transcribeAudio(audioBlob) {
  const apiKey = APIKEY;
  const speechUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

  const requestData = {
      config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
      },
      audio: {
          content: audioBlob // You need to base64 encode this audioBlob before sending
      }
  };

  try {
      const response = await fetch(speechUrl, {
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: {
              'Content-Type': 'application/json'
          }
      });
      const data = await response.json();
      console.log(data);
      // Process the transcription response
      if (data.results && data.results.length > 0) {
          const transcript = data.results.map(result => result.alternatives[0].transcript).join('\n');
          console.log('Transcript:', transcript);
          return transcript;
      } else {
          console.log('No transcription available');
          return null;
      }
  } catch (error) {
      console.error('Error transcribing audio:', error);
      return null;
  }
}

//For Feedback Form
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.setUninstallURL("https://forms.gle/SA7shHbtMaFYczxv7");
    }
  });
})();