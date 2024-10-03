const vsDarkBlue = [103, 154, 209];
const vsLightBlue = [170, 218, 250];
const vsBlue = [111, 191, 249];
const vsWhite = [212, 212, 212];
const vsTan = [220, 220, 175];
const vsOrange = [197, 148, 124];
const vsYellow = [249, 216, 73];
const vsGreen = [116, 152, 93];
const vsMagenta = [204, 118, 209];
const vsTurqoise = [113, 198, 177];
const vsBackground = [31, 31, 31];

const letterColors = [
  vsDarkBlue,
  vsLightBlue,
  vsBlue,
  vsWhite,
  vsTan,
  vsOrange,
  vsYellow,
  vsGreen,
  vsMagenta,
  vsTurqoise,
];

function preload() {
  // Read .py input file
  src = loadStrings('data/test0.py');
}

function setup() {
  // Create canvas with background
  // 800 x 3200
  createCanvas(200, 200);
  background(vsBackground);
  letterScale = 0.05; // 0.4

  // // Draw line numbers along the left side
  // textSize(18);
  // textFont("Monaco");
  // fill(111, 118, 128);
  // textAlign(RIGHT, BOTTOM);
  // let yCoord = 25;
  // let counter = 1;
  // while (yCoord < height) {
  //   text(`${counter}`, 60, yCoord);
  //   yCoord+=28;
  //   counter++;
  // }
  // stroke(111, 118, 128);
  // strokeWeight(0.5);
  // line(70, 10, 70, height - 10);

  // Create buffer
  buff = createGraphics(width, height);

  leftMargin = 10; // 75
  margin = 10;

  frameRate(10);

}

function drawShapeFromWord(word, x, y, color, buff, scale=1, thresh1=176, thresh2=40, blur=10) {
  // We will draw everything to a buffer
  buff.background(255, 255, 255);

  // Set params
  const dispMax = (80 / 2) * sqrt(word.length) * scale; // experimentally determined
  const rotMax = 2 * PI;
  buff.textSize(200 * scale);
  buff.textFont("Monaco");
  buff.fill(0);
  buff.textAlign(CENTER, CENTER);

  // Move origin to desired location
  buff.translate(x, y);

  // Draw the letters with random rotations and translations
  for (const letter of word) {
    let disp = random(-dispMax, dispMax);
    let rot = random(0, rotMax);
    buff.push();
    buff.rotate(rot);
    buff.text(letter, disp, 0);
    buff.pop();
  }

  // Blur the letters
  buff.filter(BLUR, blur * scale);

  // Set pixels according to thresholds
  buff.loadPixels();
  for (let i = 0; i < buff.pixels.length; i+=4) {
    // Colored pixels
    if (buff.pixels[i] < thresh1 && buff.pixels[i] > thresh2) {
      buff.pixels[i]   = color[0];
      buff.pixels[i+1] = color[1];
      buff.pixels[i+2] = color[2];
      buff.pixels[i+3] = 255;
    }
    // Transparent pixels
    else {
      buff.pixels[i]   = 255;
      buff.pixels[i+1] = 255;
      buff.pixels[i+2] = 255;
      buff.pixels[i+3] = 0;
    }
  }
  buff.updatePixels();

  // Draw buffer to canvas
  image(buff, 0, 0);
  buff.clear();
}

function draw() {
  // textSize(14);
  // fill(255);
  // textAlign(LEFT, TOP);
  // text(`Thresh 1: ${thresh1}`, 180, 15);
  // text(`Thresh 2: ${thresh2}`, 180, 35);

  // Parse input
  for (let i = 0; i < src.length; i++) {
    let tokens = src[i].split(/\s+/);
    for (let j = 0; j < tokens.length; j++) {
      let ind = Math.floor(Math.random() * letterColors.length);
      let randColor = letterColors[ind];
      drawShapeFromWord(
        tokens[j],
        random(leftMargin, width - margin),
        random(margin, height - margin),
        randColor,
        buff,
        letterScale
      );
      console.log(`finished line ${i} word ${j}`);
    }
  }

  // Maybe I can add shapes line by line insted of all at once
}
