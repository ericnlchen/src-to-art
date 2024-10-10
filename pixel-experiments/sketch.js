let existingCanvas;

function preload() {
  srcEight = loadStrings('data/eight');
  srcBlackjack = loadStrings('data/blackjack');
  srcBrick = loadStrings('data/brick');
  srcs = [
    srcBrick,
    srcEight,
    srcBlackjack,
  ]
  srcIndex = 0;
}

function drawLineNumbers() {
  // Draw line numbers
  textSize(18);
  textFont("Monaco");
  fill(111, 118, 128);
  textAlign(RIGHT, BOTTOM);
  let yCoord = 25;
  let counter = 1;
  while (yCoord < height) {
    text(`${counter}`, 60, yCoord);
    yCoord+=28;
    counter++;
  }
  stroke(111, 118, 128);
  strokeWeight(0.5);
  line(70, 10, 70, height - 10);
}

function setup() {
  pixelDensity(2);
  let canvas = createCanvas(1450, 750);
  canvas.parent('sketch-holder-0');
  editor = document.getElementById('editor');
  resizeCanvas(editor.offsetWidth, editor.offsetHeight);
  background(31, 31, 31);

  // Add click event to each tab
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab, ind) => {
    if (ind > 0) {
      tab.addEventListener('click', () => {
        reset(ind - 1);
      });
    }
  });

  speed = 100;
  margin = 0;

  drawLineNumbers();

  currFrameCount = 0;

  playing = true;

  let playButton = createButton('\u23f8');
  playButton.position(1400, 30);
  playButton.style("font-family", "Times New Roman");
  playButton.style("font-size", "23px");
  playButton.style("height", "35px");
  playButton.style("width", "35px");
  playButton.style("background-color", "rgb(130, 130, 130)");
  playButton.style("border-style", "none");
  playButton.style("border-radius", "2px");
  playButton.mouseClicked(() => {
    if (playButton.elt.innerHTML === '\u23f5') {
      playButton.elt.innerHTML = '\u23f8';
      playing = true;
    }
    else {
      playButton.elt.innerHTML = '\u23f5';
      playing = false;
    }
  })

  let stopButton = createButton('\u23f9');
  stopButton.position(1450, 30);
  stopButton.style("font-family", "Times New Roman");
  stopButton.style("font-size", "23px");
  stopButton.style("height", "35px");
  stopButton.style("width", "35px");
  stopButton.style("background-color", "rgb(130, 130, 130)");
  stopButton.style("border-style", "none");
  stopButton.style("border-radius", "2px");
  stopButton.mouseClicked(() => {
    reset(srcIndex);
    playing = false;
    playButton.elt.innerHTML = '\u23f5';
  })
}

function draw() {
  // Note: I think transformations are cumulative and they don't automatically reset between draw calls.
  // Makes the behavior interesting and unpredictable.

  if (srcIndex === null) {
    return;
  }

  let src = srcs[srcIndex];

  // speed = speedSlider.value();
  if (currFrameCount > 60 * 60) {
    return;
  }
  if (currFrameCount % 600 === 0 && currFrameCount > 1) {
    fill(31, 31, 31, 4);
    rect(0, 0, width, height)
    filter(BLUR, 1);
  }

  noStroke();

  let frameFactor = (speed / 1500) * currFrameCount;

  translate(width/2, height/2);
  let col = [50, 50, 50, 255];
  let colStep = 10;
  let w = 10;
  let h = 10;

  let instrSet = {};
  for (const line of src) {
    // Check where current origin is, correct if needed
    let originX = drawingContext.getTransform().e - width/2;
    let originY = drawingContext.getTransform().f - height/2;

    if (originX > width - margin || originX < margin || originY > height - margin || originY < margin) {
      translate(width/2 - originX, height/2 - originY);
    }

    if (w > 30)
      w = 10;
    if (h > 30)
      h = 10;
    for (let i = 0; i < 3; i++) {
      if (col[i] > 255 || col[i] < 0)
        col[i] = 100;
    }
    if (colStep > 200) {
      colStep = 10;
    }

    if (line.split(' ')[0] === 'Disassembly' || line === '')
      continue;

    fill(col);
    const secNum = line.slice(0, 7).trim();
    const byteNum = line.slice(10, 15).trim();
    const instr = line.slice(15, 39).trim();
    const register = line.slice(39, 43).trim();
    const literal = line.slice(43).trim();

    let effectiveFrameFactor = frameFactor;
    // Make different parts of the image 'reset' at different times
    // Seven different groups reset at different times
    // We will get a full reset at some point related to GCF
    // effectiveFrameFactor = frameFactor % (((byteNum / 2) % 7) + 1);

    if (instrSet[instr]) instrSet[instr]+=1; else instrSet[instr]=1;

    switch(instr) {
      case 'LOAD_CONST': // lots
        // Move vertically and draw a pixel
        let dy;
        if (literal.length % 2 === 0) {
          // dy = h * effectiveFrameFactor;
          dy = h;
        }
        else {
          // dy = -h * effectiveFrameFactor;
          dy = -h;
        }
        translate(0, dy);
        rect(0, 0, w, h);
        break;
      case 'LOAD_FAST': // lots
        // Move horizontally and draw a pixel
        let dx;
        if (literal.length % 2 === 0) {
          // dx = w * effectiveFrameFactor;
          dx = w;
        }
        else {
          // dx = -w * effectiveFrameFactor;
          dx = -w;
        }
        translate(dx, 0);
        rect(0, 0, w, h);
        break;
      case 'CALL_FUNCTION': // lots
      case 'CALL_FUNCTION_KW':
        // push location
        push();
        // change the color
        let dcol = [0, 0, 0];
        dcol[register % 3] = colStep;
        if (register % 2 === 0)
          col = [col[0] + dcol[0], col[1] + dcol[1], col[2] + dcol[2], col[3]];
        else
          col = [col[0] - dcol[0], col[1] - dcol[1], col[2] - dcol[2], col[3]];
        for (let i = 0; i < 3; i++) {
          if (col[i] > 255 || col[i] < 0)
            col[i] = 100;
        }
        break;
      case 'LOAD_GLOBAL': // lots
        // pop back to last pushed location
        pop();
        break;
      case 'POP_TOP':
        // color the surrounding pixels with transparent colors
        let tempCol = [col[1], col[2], col[0], 30];
        fill(tempCol);
        rect(w, h, 2*w, 2*h);
        rect(-w, h, -2*w, 2*h);
        rect(w, -h, 2*w, -2*h);
        rect(-w, -h, -2*w, -2*h);
        break;
      case 'LOAD_ATTR':
        // // add a random mini pixel on the canvas
        // let rectLoc = [random(0, width), random(0, height)];
        // rect(rectLoc[0], rectLoc[1], 5, 5);
        break;
      case 'LOAD_NAME':
        // increase the size of the pixels and make them slighly less opaque
        w += effectiveFrameFactor;
        h += effectiveFrameFactor;
        col[3] -= 10;
        break;
      case 'STORE_NAME':
        colStep += 0.0005 * currFrameCount;
        // colStep += 1;
        break;
      case 'IMPORT_NAME':
        break;
      case 'LOAD_BUILD_CLASS':
        break;
      case 'MAKE_FUNCTION':
        break;
      case 'COMPARE_OP':
        break;
      case 'POP_JUMP_IF_FALSE':
        break;
      case 'BUILD_LIST':
        break;
      case 'GET_ITER':
        break;
      case 'FOR_ITER':
        break;
    }
  }
  if (playing)
    currFrameCount += 1;
}

function reset(ind) {
  srcIndex = ind;
  clear();
  // drawLineNumbers();
  currFrameCount = 0;
}