let font;

function preload() {
  font = loadFont('https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf');
}

class TetrahedronIdentityAnimation extends AnimationBase {
  constructor() {
    super('Tetrahedron Identity', '3D conceptual tetrahedron with four corners representing different aspects of identity');
    this.duration = 15000;
    this.corners = [
      { name: "Social: Good", color: color(150, 100, 255), pos: createVector(-180, 120, -120) }, // Purple
      { name: "Social: Bad", color: color(255, 70, 70), pos: createVector(180, 120, -120) },     // Red
      { name: "Instinctual", color: color(255, 180, 50), pos: createVector(0, 120, 180) },      // Orange
      { name: "Naiveté", color: color(50, 255, 150), pos: createVector(0, -180, 0) }            // Green
    ];
  }

  setup() {
    createCanvas(600, 600, WEBGL); // Square format, more compact
    textFont(font);
    this.startTime = millis();
  }

  draw() {
    background(25, 35, 55); // Deep navy blue
    
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
    // Draw spheres and text FIRST - ALWAYS VISIBLE
    for (let i = 0; i < this.corners.length; i++) {
      this.drawCorner(i, rotY);
    }
    
    // Draw wireframe edges FIRST
    this.drawWireframeEdges(rotY);
    
    // Draw prism fill AFTER wireframe (so fill doesn't hide edges)
    push();
    rotateY(rotY);
    
    // Warm gold fill with very low opacity - won't hide wireframe
    fill(255, 200, 120, 15);
    noStroke(); // No stroke to avoid conflicts with wireframe
    
    // Bottom triangle face
    beginShape(TRIANGLES);
    vertex(this.corners[0].pos.x, this.corners[0].pos.y, this.corners[0].pos.z);
    vertex(this.corners[1].pos.x, this.corners[1].pos.y, this.corners[1].pos.z);
    vertex(this.corners[2].pos.x, this.corners[2].pos.y, this.corners[2].pos.z);
    endShape();
    
    // Three side triangular faces
    for (let i = 0; i < 3; i++) {
      let next = (i + 1) % 3;
      beginShape(TRIANGLES);
      vertex(this.corners[i].pos.x, this.corners[i].pos.y, this.corners[i].pos.z);
      vertex(this.corners[next].pos.x, this.corners[next].pos.y, this.corners[next].pos.z);
      vertex(this.corners[3].pos.x, this.corners[3].pos.y, this.corners[3].pos.z);
      endShape();
    }
    
    pop();
  }

  drawWireframeEdges(rotY) {
    // Draw all edges as individual lines to avoid depth testing issues
    for (let i = 0; i < this.corners.length; i++) {
      for (let j = i + 1; j < this.corners.length; j++) {
        this.drawEdgeLine(i, j, rotY);
      }
    }
  }

  drawEdgeLine(i, j, rotY) {
    push();
    rotateY(rotY);
    
    stroke(100, 110, 130, 200);
    strokeWeight(2);
    
    line(this.corners[i].pos.x, this.corners[i].pos.y, this.corners[i].pos.z,
         this.corners[j].pos.x, this.corners[j].pos.y, this.corners[j].pos.z);
    
    pop();
  }

  drawCorner(index, rotY) {
    push();
    rotateY(rotY);
    translate(this.corners[index].pos.x, this.corners[index].pos.y, this.corners[index].pos.z);
    
    // Calculate depth for opacity
    let rotatedZ = this.corners[index].pos.z * cos(rotY) - this.corners[index].pos.x * sin(rotY);
    let opacity = map(rotatedZ, -240, 240, 120, 255);
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
    
    // White text for navy background
    fill(255, 255, 255, opacity);
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
  animation = new TetrahedronIdentityAnimation();
  animation.setup();
}

function draw() {
  animation.draw();
}

function keyPressed() {
  animation.keyPressed();
}