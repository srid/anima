class AnimationBase {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.isRecording = false;
    this.recorder = null;
    this.startTime = 0;
    this.duration = 10000; // 10 seconds default
    
    // Video recording properties
    this.isVideoRecording = false;
    this.videoRecorder = null;
    this.recordedChunks = [];
  }

  setup() {
    throw new Error('setup() must be implemented by subclass');
  }

  draw() {
    throw new Error('draw() must be implemented by subclass');
  }

  startRecording() {
    if (typeof saveGif === 'function') {
      this.isRecording = true;
      this.startTime = millis();
      console.log(`Recording ${this.name}...`);
    } else {
      console.warn('p5.js-gif not available. Install with: npm install p5.js-gif');
    }
  }

  checkRecordingComplete() {
    if (this.isRecording && millis() - this.startTime >= this.duration) {
      this.stopRecording();
    }
  }

  stopRecording() {
    if (this.isRecording && typeof saveGif === 'function') {
      this.isRecording = false;
      const filename = `${this.name.toLowerCase().replace(/\s+/g, '-')}.gif`;
      saveGif(filename, this.duration / 1000);
      console.log(`Saved ${filename}`);
    }
  }

  startVideoRecording() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      console.warn('MediaRecorder not supported in this browser');
      return;
    }

    if (this.isVideoRecording) {
      console.warn('Already recording video');
      return;
    }

    try {
      // Get canvas stream
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        console.error('Canvas not found');
        return;
      }

      const stream = canvas.captureStream(60); // 60fps
      
      // Try MP4 first for X.com compatibility, then WebM fallbacks
      let options;
      if (MediaRecorder.isTypeSupported('video/mp4; codecs=h264')) {
        options = {
          mimeType: 'video/mp4; codecs=h264',
          videoBitsPerSecond: 25000000 // 25 Mbps for premium quality
        };
        this.videoFormat = 'mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
        options = {
          mimeType: 'video/webm; codecs=vp9',
          videoBitsPerSecond: 25000000 // 25 Mbps for premium quality
        };
        this.videoFormat = 'webm';
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp8')) {
        options = {
          mimeType: 'video/webm; codecs=vp8',
          videoBitsPerSecond: 20000000 // 20 Mbps for VP8
        };
        this.videoFormat = 'webm';
      } else {
        options = {
          videoBitsPerSecond: 20000000 // 20 Mbps fallback
        };
        this.videoFormat = 'webm';
      }
      
      this.videoRecorder = new MediaRecorder(stream, options);

      this.recordedChunks = [];

      this.videoRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.videoRecorder.onstop = () => {
        this.saveVideoFile();
      };

      this.videoRecorder.start();
      this.isVideoRecording = true;
      console.log(`🔴 Started video recording ${this.name}...`);
    } catch (error) {
      console.error('Failed to start video recording:', error);
    }
  }

  stopVideoRecording() {
    if (!this.isVideoRecording || !this.videoRecorder) {
      console.warn('No video recording in progress');
      return;
    }

    this.videoRecorder.stop();
    this.isVideoRecording = false;
    console.log('⏹️ Stopped video recording');
  }

  saveVideoFile() {
    if (this.recordedChunks.length === 0) {
      console.error('No video data to save');
      return;
    }

    const mimeType = this.videoFormat === 'mp4' ? 'video/mp4' : 'video/webm';
    const blob = new Blob(this.recordedChunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `${this.name.toLowerCase().replace(/\s+/g, '-')}-video-${timestamp}.${this.videoFormat}`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`💾 Saved video: ${filename}`);
  }

  keyPressed() {
    if (key === 'r' || key === 'R') {
      this.startRecording();
    } else if (key === 'v' || key === 'V') {
      this.startVideoRecording();
    } else if (key === 's' || key === 'S') {
      this.stopVideoRecording();
    }
  }
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function oscillate(time, period = 2000) {
  return sin(TWO_PI * time / period);
}

function pulse(time, period = 1000) {
  return (1 + sin(TWO_PI * time / period)) * 0.5;
}

function cycle(time, period = 3000) {
  return (time % period) / period;
}