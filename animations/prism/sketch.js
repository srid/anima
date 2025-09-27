let font;

function preload() {
  font = loadFont('https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf');
}

class PrismAnimation extends AnimationBase {
  constructor() {
    super('Prism', '3D conceptual prism with four corners representing different aspects of behavior');
    this.duration = 15000;
    this.corners = [
      { name: "Social: Good", color: color(150, 100, 255), pos: createVector(-150, 150, -100) }, // Purple
      { name: "Social: Bad", color: color(255, 70, 70), pos: createVector(150, 150, -100) },     // Red
      { name: "Instinctual", color: color(255, 180, 50), pos: createVector(0, 150, 150) },      // Orange
      { name: "Naiveté", color: color(50, 255, 150), pos: createVector(0, -150, 0) }            // Green
    ];
  }

  setup() {
    createCanvas(800, 600, WEBGL);
    textFont(font);
    this.startTime = millis();
  }

  draw() {
    background(220, 230, 240);
    
    // Lighting
    ambientLight(80);
    directionalLight(255, 255, 255, -1, 0.5, -1);
    directionalLight(150, 150, 200, 1, -0.5, 0.5);
    
    // Gentle rotation
    let rotY = millis() * 0.001;
    
    // Remove debug output
    
    // Draw everything
    this.drawEverything(rotY);
    
    this.checkRecordingComplete();
  }

  drawEverything(rotY) {
    push();
    rotateY(rotY);
    
    // Draw prism wireframe
    stroke(100, 110, 130, 150);
    strokeWeight(2);
    noFill();
    
    // Bottom triangle
    beginShape();
    vertex(this.corners[0].pos.x, this.corners[0].pos.y, this.corners[0].pos.z);
    vertex(this.corners[1].pos.x, this.corners[1].pos.y, this.corners[1].pos.z);
    vertex(this.corners[2].pos.x, this.corners[2].pos.y, this.corners[2].pos.z);
    vertex(this.corners[0].pos.x, this.corners[0].pos.y, this.corners[0].pos.z);
    endShape();
    
    // Lines to top
    for (let i = 0; i < 3; i++) {
      beginShape();
      vertex(this.corners[i].pos.x, this.corners[i].pos.y, this.corners[i].pos.z);
      vertex(this.corners[3].pos.x, this.corners[3].pos.y, this.corners[3].pos.z);
      endShape();
    }
    
    pop();
    
    // Draw spheres and text - ALWAYS VISIBLE
    for (let i = 0; i < this.corners.length; i++) {
      this.drawCorner(i, rotY);
    }
  }

  drawCorner(index, rotY) {
    push();
    rotateY(rotY);
    translate(this.corners[index].pos.x, this.corners[index].pos.y, this.corners[index].pos.z);
    
    // Calculate depth for opacity
    let rotatedZ = this.corners[index].pos.z * cos(rotY) - this.corners[index].pos.x * sin(rotY);
    let opacity = map(rotatedZ, -200, 200, 120, 255);
    opacity = constrain(opacity, 120, 255);
    
    // Draw sphere
    fill(red(this.corners[index].color), green(this.corners[index].color), blue(this.corners[index].color), opacity);
    noStroke();
    sphere(20);
    
    // Pulsing glow
    let pulseSize = 25 + sin(millis() * 0.01 + index) * 8;
    fill(red(this.corners[index].color), green(this.corners[index].color), blue(this.corners[index].color), opacity * 0.3);
    sphere(pulseSize);
    
    pop();
    
    // Draw text label
    push();
    rotateY(rotY);
    translate(this.corners[index].pos.x, this.corners[index].pos.y, this.corners[index].pos.z);
    
    // Offset text
    let offset = (index === 3) ? createVector(0, 40, 0) : createVector(0, -40, 0);
    translate(offset.x, offset.y, offset.z);
    
    // Face camera
    rotateY(-rotY);
    
    // Text with opacity
    fill(0, 0, 0, opacity);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(this.corners[index].name, 0, 0);
    
    pop();
  }

  updateCornerActivation(progress) {
    // Keep all corners active
    for (let i = 0; i < this.corners.length; i++) {
      this.corners[i].active = true;
    }
  }

  drawCornerInfo(progress) {
    // Skip 2D overlay
  }

  keyPressed() {
    super.keyPressed();
  }
}

let animation;

function setup() {
  animation = new PrismAnimation();
  animation.setup();
}

function draw() {
  animation.draw();
}

function keyPressed() {
  animation.keyPressed();
}