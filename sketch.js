const DEF = 'def';
const IMPORT = 'import';
const RETURN = 'return';
const IF = 'if';
const ELSE = 'else';
const ELIF = 'elif';
const FOR = 'for';
const PRINT = 'print';
const EQUALS = '=';
const CLASS = 'class';

function preload() {
  // Read .py input file
  src = loadStrings('data/test1.py');
}

function setup() {
  createCanvas(900, 800);
  background(255);
  // Tokenize src
  const tokenizedSrc = tokenize(src);
  // Transform to art
  srcToArt(tokenizedSrc);
}

function draw() {
  // Don't actually need this right now
}

function randomCircle(xMin=0, xMax=null, yMin=0, yMax=null, rMin=50, rMax=100) {
  xMax = (xMax === null) ? width : xMax;
  yMax = (yMax === null) ? height : yMax;
  fill(color(random(100, 256), random(100, 256), random(100, 256), random(100, 256)));
  noStroke();
  const x = random(xMin, xMax);
  const y = random(yMin, yMax);
  const r = random(rMin, rMax);
  circle(x, y, r);
}

function randomTriangle(xMin=0, xMax=null, yMin=0, yMax=null, rMin=50, rMax=100) {
  xMax = (xMax === null) ? width : xMax;
  yMax = (yMax === null) ? height : yMax;
  fill(color(random(100, 256), random(100, 256), random(100, 256), random(100, 256)));
  noStroke();
  const center = createVector(random(xMin, xMax), random(yMin, yMax));
  const radius = random(rMin, rMax);
  const theta = random(0, 2*PI);
  const disp = p5.Vector.fromAngle(theta, radius);
  const points = [
    p5.Vector.add(center, disp),
    p5.Vector.add(center, p5.Vector.rotate(disp, 2 * PI / 3)),
    p5.Vector.add(center, p5.Vector.rotate(disp, 4 * PI / 3))
  ];
  triangle(
    points[0].x, points[0].y,
    points[1].x, points[1].y,
    points[2].x, points[2].y
  );
  // stroke(0);
  // strokeWeight(30);
  // point(points[1].x, points[1].y);
  // stroke(255, 0, 0);
  // strokeWeight(30);
  // point(center.x, center.y);
}

function srcToArt(tokenizedSrc) {
  // Transform tokenized source code into art!
  let lineNum = 0;
  let totalLines = tokenizedSrc.length;
  for (const line of tokenizedSrc) {
    if (line[0] === DEF) {
      const yVal = (lineNum / totalLines) * height;
      randomCircle(0, width, yVal, yVal);
    }
    else if (line[0] === IMPORT) {
      const yVal = (lineNum / totalLines) * height;
      randomCircle(0, width, yVal, yVal);
    }
    else if (line[0] === RETURN) {
      const yVal = (lineNum / totalLines) * height;
      randomTriangle(0, width, yVal, yVal);
    }
    else if (line[0] === IF) {
      const yVal = (lineNum / totalLines) * height;
      randomCircle(0, width, yVal, yVal);
    }
    else if (line[0] === ELSE) {
      const yVal = (lineNum / totalLines) * height;
      randomCircle(0, width, yVal, yVal);
    }
    else if (line[0] === FOR) {
      const yVal = (lineNum / totalLines) * height;
      randomCircle(0, width, yVal, yVal);
    }
    else if (line[0] === PRINT) {
      const yVal = (lineNum / totalLines) * height;
      randomCircle(0, width, yVal, yVal);
    }
    else if (line[0] === ELIF) {
      const yVal = (lineNum / totalLines) * height;
      randomCircle(0, width, yVal, yVal);
    }
    else if (line[0] === CLASS) {
      const yVal = (lineNum / totalLines) * height;
      randomCircle(0, width, yVal, yVal);
    }
    else {
      // Didn't recognize token 0, check token 1
      if (line[1] === EQUALS) {
        const yVal = (lineNum / totalLines) * height;
        randomCircle(0, width, yVal, yVal);
      }
    }
    lineNum++;
  }
}

function srcToArtTurtle(tokenizedSrc) {
  let lineNum = 0;
  let totalLines = tokenizedSrc.length;
  for (const line of tokenizedSrc) {
    if (line[0] === DEF) {

    }
    else if (line[0] === IMPORT) {

    }
    else if (line[0] === RETURN) {

    }
    else if (line[0] === IF) {

    }
    else if (line[0] === ELSE) {

    }
    else if (line[0] === FOR) {

    }
    else if (line[0] === PRINT) {

    }
    else if (line[0] === ELIF) {

    }
    else if (line[0] === CLASS) {

    }
    else {
      // Didn't recognize token 0, check token 1
      if (line[1] === EQUALS) {
        
      }
    }
    lineNum++;
  }
}

function tokenize(src) {
  // Split up each line of src into semantically meaningful tokens
  let tokenizedSrc = [];
  for (let line of src) {
    // Remove indents
    line = line.trimStart();
    // Separate out the string literals, odd indices will be strings
    segments = line.split("'"); // assuming all strings are enclosed in single quotes...
    for (let i = 0; i < segments.length; i++) {
      // For strings...
      if (i % 2 !== 0) {
        segments[i] = "'" + segments[i] + "'";
      }
      // For non-strings...
      else {
        // Find comments
        if (segments[i].includes('#')) {
          // Remove every character after the # from the segment
          segments[i] = segments[i].split('#')[0];
          // Remove every segment after the one that had #
          segments = segments.slice(0, i+1);
          break;
        }
        // Split the segment by whitespace
        segments[i] = segments[i].split(/\s+/);
      }
    }
    // Concatenate all the subsegments together
    segments = segments.flat();
    tokenizedSrc.push(segments);
  }
  return tokenizedSrc;
}