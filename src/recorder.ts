import type {
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng/esm";

export function startRecording(remoteTrack: IRemoteVideoTrack) {

    let mediaRecorder: MediaRecorder;
    let recordedChunks: Blob[] = [];
  
    // Initialize MediaRecorder
    const remoteStream = new MediaStream();
    remoteStream.addTrack(remoteTrack.getMediaStreamTrack());
    mediaRecorder = new MediaRecorder(remoteStream);
  
    // Event listener for data available
    mediaRecorder.ondataavailable = function(event) {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
  
    // Event listener for stop
    mediaRecorder.onstop = function() {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'video.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };
  
    // Start recording
    mediaRecorder.start();
  
    // Function to stop recording
    return function stopRecording() {
      mediaRecorder.stop();
    };
  }