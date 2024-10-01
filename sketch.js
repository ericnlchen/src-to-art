function setup() {
    createCanvas(800, 800);
    background(255, 255, 255);
    
    thresh1 = 176;
    thresh2 = 30;
    
    // Set params
    const word = 'randomCircle';
    const dispMax = (80 / 2) * sqrt(word.length); // experimentally determined
    const rotMax = 2 * PI;
    
    // Move origin to middle of canvas
    translate(width/2, height/2);
    
    textSize(200);
    textFont('Courier New')
    textAlign(CENTER, CENTER);
    for (const letter of word) {
      push();
      let disp = random(-dispMax, dispMax);
      let rot = random(0, rotMax);
      rotate(rot);
      text(letter, disp, 0);
      pop();
    }
    
    filter(BLUR, 10);
    
    loadPixels();
    originalPixels = [...pixels];
  }
  
  function draw() {
    // Set pixels according to thresholds
    for (let i = 0; i < originalPixels.length; i++) {
      if ((i + 1) % 4 === 0)
        continue;
      if (originalPixels[i] > thresh1 ||
          originalPixels[i] < thresh2)
        pixels[i] = 255;
      else
        pixels[i] = 0;
    }
    
    // Reset colors appropriately
    const vsBlue = [103, 154, 209];
    const vsBackground = [31, 31, 31];
    for (let i = 0; i < pixels.length; i++) {
      if ((i + 1) % 4 === 0)
        continue;
      if (pixels[i] === 255)
        pixels[i] = vsBackground[i % 4];
      else
        pixels[i] = vsBlue[i % 4];
    }
    updatePixels();
    
    textSize(14);
    fill(255);
    textAlign(LEFT, TOP);
    text(`Thresh 1: ${thresh1}`, 180, 15);
    text(`Thresh 2: ${thresh2}`, 180, 35);
  
  
    // Idea: Map each name to an abstract shape once, then replace all occurrences
    // with the same shape.
    // Leave control symbols like (,;[ etc. in place, just replace names
    // But don't want to make it too code-like...
  }