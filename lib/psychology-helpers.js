function drawEmotionalState(x, y, size, emotion) {
  push();
  translate(x, y);
  
  switch(emotion) {
    case 'calm':
      fill(100, 150, 255, 150);
      ellipse(0, 0, size);
      break;
    case 'anxious':
      fill(255, 100, 100, 150);
      for(let i = 0; i < 8; i++) {
        rotate(PI/4);
        ellipse(size/4, 0, size/3, size/6);
      }
      break;
    case 'focused':
      fill(100, 255, 100, 150);
      beginShape();
      for(let a = 0; a < TWO_PI; a += PI/6) {
        let r = size/2;
        vertex(cos(a) * r, sin(a) * r);
      }
      endShape(CLOSE);
      break;
  }
  pop();
}

function drawMindState(x, y, thoughts = []) {
  push();
  translate(x, y);
  
  fill(255, 255, 255, 100);
  stroke(200);
  ellipse(0, 0, 150);
  
  thoughts.forEach((thought, i) => {
    push();
    rotate(i * TWO_PI / thoughts.length);
    translate(0, -60);
    fill(thought.color || color(100, 150, 255));
    noStroke();
    ellipse(0, 0, thought.size || 20);
    pop();
  });
  
  pop();
}

function drawConnection(x1, y1, x2, y2, strength = 1, animated = false) {
  let alpha = 255 * strength;
  if (animated) {
    alpha *= (1 + sin(millis() * 0.005)) * 0.5;
  }
  
  stroke(100, 150, 255, alpha);
  strokeWeight(2 * strength);
  line(x1, y1, x2, y2);
  
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2;
  fill(100, 150, 255, alpha);
  noStroke();
  ellipse(midX, midY, 4);
}

function drawBrainRegion(x, y, size, activity = 0.5, label = '') {
  push();
  translate(x, y);
  
  let activityColor = lerpColor(
    color(100, 100, 100),
    color(255, 200, 100),
    activity
  );
  
  fill(activityColor);
  stroke(50);
  strokeWeight(2);
  ellipse(0, 0, size);
  
  if (label) {
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text(label, 0, size/2 + 15);
  }
  
  pop();
}

function drawFlowState(x, y, size, flow = 0.5) {
  push();
  translate(x, y);
  
  for(let i = 0; i < 5; i++) {
    let alpha = 255 * flow * (1 - i * 0.2);
    fill(100, 200, 255, alpha);
    noStroke();
    ellipse(0, 0, size - i * 10);
  }
  
  pop();
}