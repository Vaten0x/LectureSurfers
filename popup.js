document.getElementById('startBtn').addEventListener('click', function() {
  navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(stream => {
    if(stream.getAudioTracks().length == 0) return alert('You must share your tab with audio. Refresh the page.')
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    //alert('Test 1! You passed to share capture audio!')
    
    socket = new WebSocket('wss://api.deepgram.com/v1/listen', ['token', '55be89c3245dcfcdf3887b90502d0aa29d3fb035'])

    recorder.addEventListener('dataavailable', evt => {
        if(evt.data.size > 0 && socket.readyState == 1) socket.send(evt.data)
    })

    socket.onopen = () => {
      try {
        recorder.start(250);
      } catch (e) {
        console.error('Failed to start MediaRecorder:', e);
        document.getElementById('status').textContent = "Failed to start recording. Please try again.";
      }
    };

    socket.onmessage = msg => {
      const { transcript } = JSON.parse(msg.data).channel.alternatives[0]
      if(transcript) {
          console.log(transcript)
      }
    }

  }).catch(function(error) {
      console.error('Failed to capture audio:', error);
      document.getElementById('status').textContent = "Failed to capture audio. Please try again.";
    });
});
