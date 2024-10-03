
function preload() {
  src = loadStrings('data/eight')
}

function setup() {
  createCanvas(1000, 1000);
}

function draw() {
  background(0, 0, 0);
  noStroke();

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

    if (originX > width || originX < 0 || originY > height || originY < 0) {
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

    if (line.split(' ')[0] === 'Disassembly' || line === '')
      continue;

    fill(col);
    const secNum = line.slice(0, 7).trim();
    const byteNum = line.slice(10, 15).trim();
    const instr = line.slice(15, 39).trim();
    const register = line.slice(39, 43).trim();
    const literal = line.slice(43).trim();
    if (instrSet[instr]) instrSet[instr]+=1; else instrSet[instr]=1;
    console.log(frameCount / 1500);
    switch(instr) {
      case 'LOAD_CONST': // lots
        // Move vertically and draw a pixel
        let dy;
        if (literal.length % 2 === 0) {
          // dy = h * (1 + (frameCount / 400));
          dy = h * (0.2 + (frameCount / 1500));
          // dy = h;
        }
        else {
          // dy = -h * (1 + (frameCount / 400));
          dy = -h * (0.2 + (frameCount / 1500));
          // dy = -h;
        }
        translate(0, dy);
        rect(0, 0, w, h);
        break;
      case 'LOAD_FAST': // lots
        // Move horizontally and draw a pixel
        let dx;
        if (literal.length % 2 === 0) {
          // dx = w * (1 + (frameCount / 400));
          dx = w * (0.2 + (frameCount / 1500));
          // dx = w;
        }
        else {
          // dx = -w * (1 + (frameCount / 400));
          dx = -w * (0.2 + (frameCount / 1500));
          // dx = -w;
        }
        translate(dx, 0);
        rect(0, 0, w, h);
        break;
      case 'CALL_FUNCTION': // lots
      case 'CALL_METHO':
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
        w += 1;
        h += 1;
        col[3] -= 5;
        break;
      case 'STORE_NAME':
        colStep += 0.0005 * frameCount;
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
}
