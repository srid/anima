class FlowStateAnimation extends AnimationBase {
  constructor() {
    super('Flow State', 'Visualization of entering and maintaining the flow state of consciousness');
    this.duration = 15000; // 15 seconds
    this.waves = [];
    this.particles = [];
    this.challenge = 0.5;
    this.skill = 0.5;
  }

  setup() {
    createCanvas(800, 600);
    colorMode(RGB);
    this.startTime = millis();
    
    // Initialize wave layers
    for (let i = 0; i < 5; i++) {
      this.waves.push({
        amplitude: 20 + i * 15,
        frequency: 0.01 + i * 0.005,
        speed: 0.02 + i * 0.01,
        offset: i * PI / 3,
        color: color(100 + i * 30, 150 + i * 20, 255 - i * 30, 100 - i * 15)
      });
    }
    
    // Initialize flow particles
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: random(width),
        y: random(height),
        vx: random(-1, 1),
        vy: random(-1, 1),
        size: random(2, 6),
        life: random(1),
        color: color(random(100, 255), random(150, 255), 255, 150)
      });
    }
  }

  draw() {
    let elapsed = millis() - this.startTime;
    let progress = (elapsed % this.duration) / this.duration;
    
    background(15, 20, 35);
    
    // Update challenge and skill levels over time
    this.updateChallengeSkill(progress);
    
    // Calculate flow level based on challenge-skill balance
    let flowLevel = this.calculateFlowLevel();
    
    // Draw the flow visualization
    this.drawFlowField(flowLevel, elapsed);
    this.drawChallengeSkillBalance();
    this.updateFlowParticles(flowLevel);
    this.drawFlowIndicators(flowLevel, progress);
    
    this.checkRecordingComplete();
  }

  updateChallengeSkill(progress) {
    // Simulate different scenarios throughout the animation
    if (progress < 0.2) {
      // Low challenge, high skill = boredom
      this.challenge = 0.3 + sin(progress * PI * 10) * 0.1;
      this.skill = 0.8;
    } else if (progress < 0.4) {
      // High challenge, low skill = anxiety
      this.challenge = 0.9;
      this.skill = 0.3 + sin(progress * PI * 8) * 0.1;
    } else if (progress < 0.8) {
      // Balanced challenge and skill = flow
      let flowProgress = (progress - 0.4) / 0.4;
      this.challenge = 0.5 + sin(flowProgress * PI * 3) * 0.2;
      this.skill = 0.5 + sin(flowProgress * PI * 3 + PI/4) * 0.2;
    } else {
      // Return to imbalance
      this.challenge = 0.6 + sin(progress * PI * 12) * 0.3;
      this.skill = 0.4 + sin(progress * PI * 8) * 0.2;
    }
  }

  calculateFlowLevel() {
    let balance = 1 - abs(this.challenge - this.skill);
    let highEngagement = min(this.challenge, this.skill);
    return balance * highEngagement * 2; // Amplify the effect
  }

  drawFlowField(flowLevel, elapsed) {
    push();
    
    // Draw flowing waves
    for (let wave of this.waves) {
      stroke(wave.color);
      strokeWeight(2 + flowLevel * 3);
      noFill();
      
      beginShape();
      for (let x = 0; x <= width + 50; x += 10) {
        let y = height/2 + 
                sin(x * wave.frequency + elapsed * wave.speed + wave.offset) * wave.amplitude * (1 + flowLevel) +
                sin(x * wave.frequency * 2 + elapsed * wave.speed * 1.5) * wave.amplitude * 0.3 * flowLevel;
        vertex(x, y);
      }
      endShape();
    }
    
    // Draw flow tunnel effect when in flow
    if (flowLevel > 0.7) {
      stroke(255, 255, 255, 100 * flowLevel);
      strokeWeight(1);
      for (let i = 0; i < 20; i++) {
        let radius = 50 + i * 30;
        let alpha = 150 * flowLevel / (i + 1);
        stroke(255, 255, 255, alpha);
        noFill();
        ellipse(width/2, height/2, radius);
      }
    }
    
    pop();
  }

  drawChallengeSkillBalance() {
    // Challenge-Skill graph
    let graphX = width - 200;
    let graphY = 50;
    let graphSize = 150;
    
    // Graph background
    fill(0, 0, 0, 100);
    stroke(100);
    rect(graphX, graphY, graphSize, graphSize);
    
    // Grid lines
    stroke(50);
    for (let i = 1; i < 4; i++) {
      let pos = i * graphSize / 4;
      line(graphX + pos, graphY, graphX + pos, graphY + graphSize);
      line(graphX, graphY + pos, graphX + graphSize, graphY + pos);
    }
    
    // Flow zone (diagonal area)
    fill(100, 255, 100, 30);
    noStroke();
    beginShape();
    vertex(graphX + graphSize * 0.3, graphY + graphSize * 0.7);
    vertex(graphX + graphSize * 0.7, graphY + graphSize * 0.3);
    vertex(graphX + graphSize * 0.9, graphY + graphSize * 0.1);
    vertex(graphX + graphSize * 0.9, graphY + graphSize * 0.3);
    vertex(graphX + graphSize * 0.7, graphY + graphSize * 0.5);
    vertex(graphX + graphSize * 0.5, graphY + graphSize * 0.7);
    vertex(graphX + graphSize * 0.1, graphY + graphSize * 0.9);
    vertex(graphX + graphSize * 0.1, graphY + graphSize * 0.7);
    endShape(CLOSE);
    
    // Current position
    let posX = graphX + this.skill * graphSize;
    let posY = graphY + (1 - this.challenge) * graphSize;
    
    fill(255, 200, 100);
    noStroke();
    ellipse(posX, posY, 12);
    
    // Labels
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("Skill →", graphX + graphSize/2, graphY + graphSize + 20);
    
    push();
    translate(graphX - 20, graphY + graphSize/2);
    rotate(-PI/2);
    text("Challenge →", 0, 0);
    pop();
    
    // Zone labels
    textSize(10);
    fill(255, 100, 100);
    text("Anxiety", graphX + graphSize * 0.8, graphY + graphSize * 0.2);
    fill(100, 100, 255);
    text("Boredom", graphX + graphSize * 0.2, graphY + graphSize * 0.8);
    fill(100, 255, 100);
    text("Flow", graphX + graphSize * 0.6, graphY + graphSize * 0.4);
  }

  updateFlowParticles(flowLevel) {
    for (let particle of this.particles) {
      // Particles behave differently based on flow level
      if (flowLevel > 0.5) {
        // In flow: particles move in harmony
        let centerX = width / 2;
        let centerY = height / 2;
        let angle = atan2(particle.y - centerY, particle.x - centerX);
        particle.vx = cos(angle + PI/2) * flowLevel * 2;
        particle.vy = sin(angle + PI/2) * flowLevel * 2;
      } else {
        // Not in flow: random movement
        particle.vx += random(-0.1, 0.1);
        particle.vy += random(-0.1, 0.1);
      }
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      // Update life
      particle.life += (flowLevel - 0.5) * 0.01;
      particle.life = constrain(particle.life, 0, 1);
      
      // Draw particle
      let alpha = particle.life * 255;
      fill(red(particle.color), green(particle.color), blue(particle.color), alpha);
      noStroke();
      ellipse(particle.x, particle.y, particle.size * particle.life);
    }
  }

  drawFlowIndicators(flowLevel, progress) {
    // Flow level indicator
    fill(255);
    textAlign(LEFT, TOP);
    textSize(16);
    text(`Flow Level: ${(flowLevel * 100).toFixed(0)}%`, 20, 20);
    
    // State description
    let state;
    if (flowLevel < 0.3) {
      if (this.challenge > this.skill) state = "Anxiety - Challenge too high";
      else state = "Boredom - Challenge too low";
    } else if (flowLevel < 0.7) {
      state = "Approaching Flow";
    } else {
      state = "Deep Flow State";
    }
    
    text(`State: ${state}`, 20, 45);
    text(`Challenge: ${(this.challenge * 100).toFixed(0)}%`, 20, 70);
    text(`Skill: ${(this.skill * 100).toFixed(0)}%`, 20, 95);
    
    // Flow characteristics when in flow
    if (flowLevel > 0.7) {
      fill(100, 255, 100);
      textSize(14);
      text("✓ Time distortion", 20, 130);
      text("✓ Effortless concentration", 20, 150);
      text("✓ Self-consciousness fades", 20, 170);
      text("✓ Sense of control", 20, 190);
    }
    
    // Instructions
    textSize(12);
    fill(255, 100);
    textAlign(LEFT, BOTTOM);
    text(`Press 'R' to record GIF`, 20, height - 20);
    
    // Progress
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
  animation = new FlowStateAnimation();
  animation.setup();
}

function draw() {
  animation.draw();
}

function keyPressed() {
  animation.keyPressed();
}