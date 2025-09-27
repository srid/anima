class AnimationBase {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.isRecording = false;
    this.recorder = null;
    this.startTime = 0;
    this.duration = 10000; // 10 seconds default
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

  keyPressed() {
    if (key === 'r' || key === 'R') {
      this.startRecording();
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