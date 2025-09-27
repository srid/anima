class CognitiveLoadAnimation extends AnimationBase {
  constructor() {
    super('Cognitive Load', 'Visualizes how cognitive load affects mental processing capacity');
    this.duration = 12000; // 12 seconds
    this.particles = [];
    this.maxParticles = 100;
  }

  setup() {
    createCanvas(800, 600);
    colorMode(RGB);
    this.startTime = millis();
    
    // Initialize particles
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: random(width),
        y: random(height),
        vx: random(-1, 1),
        vy: random(-1, 1),
        size: random(3, 8),
        processed: false,
        color: color(100, 150, 255, 150)
      });
    }
  }

  draw() {
    let elapsed = millis() - this.startTime;
    let progress = (elapsed % this.duration) / this.duration;
    
    background(20, 25, 40);
    
    // Calculate cognitive load (0 = low, 1 = high)
    let loadLevel = 0.5 + 0.4 * sin(progress * TWO_PI * 2);
    
    // Draw brain outline
    this.drawBrain(width/2, height/2, loadLevel);
    
    // Update and draw particles (thoughts/information)
    this.updateParticles(loadLevel);
    
    // Draw processing capacity indicator
    this.drawCapacityIndicator(loadLevel, progress);
    
    // Draw labels and info
    this.drawUI(loadLevel, progress);
    
    this.checkRecordingComplete();
  }

  drawBrain(x, y, loadLevel) {
    push();
    translate(x, y);
    
    // Brain glow effect based on load
    let glowAlpha = 50 + loadLevel * 100;
    for (let i = 0; i < 5; i++) {
      fill(255, 100, 100, glowAlpha / (i + 1));
      noStroke();
      ellipse(0, 0, 250 + i * 20);
    }
    
    // Main brain shape
    stroke(200);
    strokeWeight(3);
    fill(60, 70, 90, 100);
    ellipse(0, 0, 200);
    
    // Brain activity visualization
    let activityNodes = 8;
    for (let i = 0; i < activityNodes; i++) {
      let angle = i * TWO_PI / activityNodes;
      let nodeX = cos(angle) * 60;
      let nodeY = sin(angle) * 60;
      
      let activity = loadLevel + random(-0.2, 0.2);
      activity = constrain(activity, 0, 1);
      
      let nodeColor = lerpColor(
        color(100, 150, 255),
        color(255, 100, 100),
        activity
      );
      
      fill(nodeColor);
      noStroke();
      ellipse(nodeX, nodeY, 15 + activity * 10);
      
      // Connections between nodes
      if (i < activityNodes - 1) {
        let nextAngle = (i + 1) * TWO_PI / activityNodes;
        let nextX = cos(nextAngle) * 60;
        let nextY = sin(nextAngle) * 60;
        
        stroke(nodeColor);
        strokeWeight(1 + activity * 2);
        line(nodeX, nodeY, nextX, nextY);
      }
    }
    
    pop();
  }

  updateParticles(loadLevel) {
    let processingSpeed = 1 - loadLevel * 0.7; // Higher load = slower processing
    let brainCenterX = width / 2;
    let brainCenterY = height / 2;
    
    for (let particle of this.particles) {
      // Move particles toward brain
      let dx = brainCenterX - particle.x;
      let dy = brainCenterY - particle.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance > 120) {
        // Outside brain - move toward it
        particle.vx += dx * 0.001;
        particle.vy += dy * 0.001;
      } else if (!particle.processed) {
        // Inside brain - process based on load
        if (random() < processingSpeed * 0.02) {
          particle.processed = true;
          particle.color = color(100, 255, 100, 150);
        } else {
          // Bounce around inside brain when overloaded
          particle.vx += random(-0.5, 0.5);
          particle.vy += random(-0.5, 0.5);
        }
      } else {
        // Processed - move away
        particle.vx -= dx * 0.002;
        particle.vy -= dy * 0.002;
      }
      
      // Update position
      particle.x += particle.vx * processingSpeed;
      particle.y += particle.vy * processingSpeed;
      
      // Damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      
      // Reset if too far away
      if (distance > width) {
        particle.x = random(width);
        particle.y = random(height);
        particle.processed = false;
        particle.color = color(100, 150, 255, 150);
        particle.vx = random(-1, 1);
        particle.vy = random(-1, 1);
      }
      
      // Draw particle
      fill(particle.color);
      noStroke();
      ellipse(particle.x, particle.y, particle.size);
    }
  }

  drawCapacityIndicator(loadLevel, progress) {
    // Processing capacity bar
    let barX = 50;
    let barY = height - 100;
    let barWidth = 200;
    let barHeight = 20;
    
    // Background
    fill(50);
    stroke(100);
    rect(barX, barY, barWidth, barHeight);
    
    // Capacity fill
    let capacity = 1 - loadLevel;
    fill(lerpColor(color(255, 100, 100), color(100, 255, 100), capacity));
    noStroke();
    rect(barX, barY, barWidth * capacity, barHeight);
    
    // Label
    fill(255);
    textAlign(LEFT, BOTTOM);
    textSize(14);
    text("Processing Capacity", barX, barY - 5);
  }

  drawUI(loadLevel, progress) {
    // Load level indicator
    fill(255, 150);
    textAlign(LEFT, TOP);
    textSize(16);
    text(`Cognitive Load: ${(loadLevel * 100).toFixed(0)}%`, 20, 20);
    
    // Phase indicator
    let phase;
    if (progress < 0.25) phase = "Low Load - Easy Processing";
    else if (progress < 0.5) phase = "Increasing Load";
    else if (progress < 0.75) phase = "High Load - Bottlenecks Forming";
    else phase = "Overload - Reduced Performance";
    
    text(`Phase: ${phase}`, 20, 45);
    
    // Instructions
    textSize(12);
    fill(255, 100);
    text(`Press 'R' to record GIF`, 20, height - 40);
    text(`Blue dots: Incoming information | Green dots: Processed`, 20, height - 20);
    
    // Progress indicator
    textAlign(RIGHT, TOP);
    fill(255, 100);
    text(`Progress: ${(progress * 100).toFixed(1)}%`, width - 20, 20);
  }

  keyPressed() {
    super.keyPressed();
  }
}

let animation;

function setup() {
  animation = new CognitiveLoadAnimation();
  animation.setup();
}

function draw() {
  animation.draw();
}

function keyPressed() {
  animation.keyPressed();
}