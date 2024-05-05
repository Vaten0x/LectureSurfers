document.getElementById('startBtn').addEventListener('click', function() {
    chrome.desktopCapture.chooseDesktopMedia(["screen", "window", "tab", "audio"], function(streamId) {
      if (!streamId) {
        console.log('Screen sharing cancelled');
        return;
      }
      navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: streamId
          }
        }
      }).then(stream => {
        // handle the captured stream
      }).catch(error => {
        console.error('Failed to get media: ', error);
      });
    });
  });
  