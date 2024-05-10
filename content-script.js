(function() {
    let socket;

    chrome.storage.local.set({ transcript: '' });

    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(async screenStream => {
        if (screenStream.getAudioTracks().length === 0) return alert('You must share your tab with audio. Refresh the page.');

        const audioContext = new AudioContext();
        const screenAudio = audioContext.createMediaStreamSource(screenStream);
        const dest = audioContext.createMediaStreamDestination();
        screenAudio.connect(dest);
        const recorder = new MediaRecorder(dest.stream, { mimeType: 'audio/webm' });

        try {
            socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=general-enhanced', ['token', '55be89c3245dcfcdf3887b90502d0aa29d3fb035']);
        } catch (e) {
            return alert('Failed to connect to transcription server. Please try again later.');
        }

        recorder.addEventListener('dataavailable', evt => {
            if(evt.data.size > 0 && socket.readyState === 1) socket.send(evt.data);
        });

        socket.onopen = () => { recorder.start(250); };

        socket.onmessage = msg => {
            const { transcript } = JSON.parse(msg.data).channel.alternatives[0];
            if (transcript) {
                console.log(transcript);
                chrome.storage.local.get('transcript', data => {
                    chrome.storage.local.set({ transcript: data.transcript + ' ' + transcript });

                    // Throws error when popup is closed, so this swallows the errors.
                    chrome.runtime.sendMessage({ message: 'transcriptavailable' }).catch(err => ({}));
                });
            }
        };
    });

    chrome.runtime.onMessage.addListener(({ message }) => {
        if (message === 'stop') {
            if (socket) {
                socket.close();
                alert('Transcription ended');
            }
        }
    });
})();