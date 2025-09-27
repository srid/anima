let font;

function preload() {
  // Load Open Sans from Google Fonts as OTF
  font = loadFont('https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf');
}

class PrismAnimation extends AnimationBase {
  constructor() {
    super('Prism', '3D conceptual prism with four corners representing different aspects of behavior');
    this.duration = 15000; // 15 seconds
    this.rotationX = 0;
    this.rotationY = 0;
    this.corners = [
      { name: "Social: Good", color: color(50, 255, 150), active: false },
      { name: "Social: Bad", color: color(255, 70, 70), active: false },
      { name: "Instinctual", color: color(255, 180, 50), active: false },
      { name: "Naiveté", color: color(100, 150, 255), active: false }
    ];
  }

  setup() {
    createCanvas(800, 600, WEBGL);
    textFont(font);
    this.startTime = millis();
  }

  draw() {
    let elapsed = millis() - this.startTime;
    let progress = (elapsed % this.duration) / this.duration;
    
    background(220, 230, 240);
    
    // Enhanced lighting for better 3D effect
    ambientLight(80);
    directionalLight(255, 255, 255, -1, 0.5, -1);
    directionalLight(150, 150, 200, 1, -0.5, 0.5);
    
    // Gentle Y-axis rotation only
    this.rotationY = millis() * 0.001; // Gentle Y rotation
    this.rotationX = 0; // No X rotation
    
    // Debug
    if (frameCount % 60 === 0) {
      console.log('RotY:', this.rotationY.toFixed(2), 'RotX:', this.rotationX.toFixed(2));
    }
    
    // Activate corners in sequence
    this.updateCornerActivation(progress);
    
    // Draw the 3D prism
    this.draw3DPrism();
    
    // Draw corner labels and connections
    this.drawCornerInfo(progress);
    
    this.checkRecordingComplete();
  }

  updateCornerActivation(progress) {
    // Keep all corners active throughout the animation
    for (let i = 0; i < this.corners.length; i++) {
      this.corners[i].active = true;
    }
  }

  draw3DPrism() {
    push();
    
    // Apply rotations
    rotateX(this.rotationX);
    rotateY(this.rotationY);
    
    // Define the 4 vertices of the triangular prism
    let size = 300;
    let vertices = [
      createVector(-size/2, size/2, -size/3),   // Bottom left (Social: Good)
      createVector(size/2, size/2, -size/3),    // Bottom right (Social: Bad) 
      createVector(0, size/2, size/2),          // Bottom back (Instinctual)
      createVector(0, -size/2, 0)              // Top (Naiveté)
    ];
    
    // Draw the prism faces
    this.drawPrismFaces(vertices);
    
    // Draw the corner spheres
    this.drawCornerSpheres(vertices);
    
    // Draw corner labels
    this.drawCornerLabels(vertices);
    
    pop();
  }

  drawPrismFaces(vertices) {
    // More opaque faces with better shading
    fill(180, 190, 210, 120);
    stroke(100, 110, 130, 200);
    strokeWeight(2);
    
    // Bottom triangle face
    beginShape(TRIANGLES);
    vertex(vertices[0].x, vertices[0].y, vertices[0].z);
    vertex(vertices[1].x, vertices[1].y, vertices[1].z);
    vertex(vertices[2].x, vertices[2].y, vertices[2].z);
    endShape();
    
    // Three side faces
    for (let i = 0; i < 3; i++) {
      let next = (i + 1) % 3;
      beginShape(TRIANGLES);
      vertex(vertices[i].x, vertices[i].y, vertices[i].z);
      vertex(vertices[next].x, vertices[next].y, vertices[next].z);
      vertex(vertices[3].x, vertices[3].y, vertices[3].z);
      endShape();
    }
  }

  drawCornerSpheres(vertices) {
    for (let i = 0; i < this.corners.length; i++) {
      push();
      translate(vertices[i].x, vertices[i].y, vertices[i].z);
      
      if (this.corners[i].active) {
        fill(this.corners[i].color);
        noStroke();
        sphere(20);
        
        // Pulsing glow effect
        let pulseSize = 25 + sin(millis() * 0.01 + i) * 8;
        fill(red(this.corners[i].color), green(this.corners[i].color), blue(this.corners[i].color), 50);
        sphere(pulseSize);
      } else {
        fill(80, 80, 80);
        stroke(120);
        strokeWeight(1);
        sphere(8);
      }
      
      pop();
    }
  }

  drawCornerLabels(vertices) {
    for (let i = 0; i < this.corners.length; i++) {
      if (this.corners[i].active) {
        push();
        translate(vertices[i].x, vertices[i].y, vertices[i].z);
        
        // Offset label position away from sphere
        let offset = (i === 3) ? createVector(0, 40, 0) : createVector(0, -40, 0);
        translate(offset.x, offset.y, offset.z);
        
        // Make text face camera
        rotateY(-this.rotationY);
        rotateX(-this.rotationX);
        
        // Text with loaded font
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(14);
        text(this.corners[i].name, 0, 0);
        
        pop();
      }
    }
  }

  drawCornerInfo(progress) {
    // Skip 2D overlay text in WEBGL mode to avoid font errors
    // Just show the 3D prism with labels
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

