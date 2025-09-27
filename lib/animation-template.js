class TemplateAnimation extends AnimationBase {
  constructor() {
    super('Template Animation', 'A template for creating new animations');
    this.duration = 10000; // 10 seconds
  }

  setup() {
    createCanvas(800, 600);
    colorMode(RGB);
    this.startTime = millis();
  }

  draw() {
    let elapsed = millis() - this.startTime;
    let progress = (elapsed % this.duration) / this.duration;
    
    background(20, 25, 40);
    
    // Your animation code here
    push();
    translate(width/2, height/2);
    
    // Example: rotating circle
    rotate(progress * TWO_PI);
    fill(100, 150, 255);
    noStroke();
    ellipse(100, 0, 50);
    
    pop();
    
    // Show progress
    fill(255, 100);
    textAlign(LEFT, TOP);
    textSize(12);
    text(`Progress: ${(progress * 100).toFixed(1)}%`, 10, 10);
    text(`Press 'R' to record GIF`, 10, 30);
    
    this.checkRecordingComplete();
  }

  keyPressed() {
    super.keyPressed();
    // Add custom key handlers here
  }
}

let animation;

function setup() {
  animation = new TemplateAnimation();
  animation.setup();
}

function draw() {
  animation.draw();
}

function keyPressed() {
  animation.keyPressed();
}