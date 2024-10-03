// Define color arrays
int[] vsDarkBlue = {103, 154, 209};
int[] vsLightBlue = {170, 218, 250};
int[] vsBlue = {111, 191, 249};
int[] vsWhite = {212, 212, 212};
int[] vsTan = {220, 220, 175};
int[] vsOrange = {197, 148, 124};
int[] vsYellow = {249, 216, 73};
int[] vsGreen = {116, 152, 93};
int[] vsMagenta = {204, 118, 209};
int[] vsTurquoise = {113, 198, 177};
int[] vsBackground = {31, 31, 31};

int[][] letterColors = {
  vsDarkBlue, vsLightBlue, vsBlue, vsWhite, vsTan, vsOrange, 
  vsYellow, vsGreen, vsMagenta, vsTurquoise
};

String[] src;

PGraphics buff;

void setup() {
  // Create canvas with background
  size(800, 3200);
  background(vsBackground[0], vsBackground[1], vsBackground[2]);

  // Create buffer
  buff = createGraphics(width, height);

  // Load .py input file
  src = loadStrings("data/test1.py");

  // Margin for positioning
  int margin = 0;

  // Parse input
  for (int i = 0; i < src.length; i++) {
    String[] tokens = splitTokens(src[i], " ");
    for (int j = 0; j < tokens.length; j++) {
      int ind = int(random(letterColors.length));
      int[] randColor = letterColors[ind];
      drawShapeFromWord(tokens[j], random(margin, width - margin), random(margin, height - margin), randColor, buff, 0.4);
      println("finished drawing a word");
    }
  }
}

void drawShapeFromWord(String word, float x, float y, int[] col, PGraphics buff, float scale) {
  drawShapeFromWord(word, x, y, col, buff, scale, 176, 40, 10);
}

void drawShapeFromWord(String word, float x, float y, int[] col, PGraphics buff, float scale, int thresh1, int thresh2, int blur) {
  // Draw everything to the buffer
  buff.beginDraw();
  buff.background(255);

  // Set parameters
  float dispMax = (80 / 2.0) * sqrt(word.length()) * scale; // experimentally determined
  float rotMax = TWO_PI;
  buff.textSize(200 * scale);
  buff.textFont(createFont("Courier New", 200 * scale));
  buff.fill(0);
  buff.textAlign(CENTER, CENTER);

  // Move origin to the desired location
  buff.translate(x, y);

  // Draw the letters with random rotations and translations
  for (char letter : word.toCharArray()) {
    float disp = random(-dispMax, dispMax);
    float rot = random(0, rotMax);
    buff.pushMatrix();
    buff.rotate(rot);
    buff.text(letter, disp, 0);
    buff.popMatrix();
  }

  // Apply blur
  buff.filter(BLUR, blur * scale);

  // Set pixels according to thresholds
  buff.loadPixels();
  for (int i = 0; i < buff.pixels.length; i++) {
    int pixelValue = (buff.pixels[i] >> 16) & 0xFF;
    if (pixelValue < thresh1 && pixelValue > thresh2) {
      buff.pixels[i] = color( col[0], col[1], col[2], 255 );
    } else {
      buff.pixels[i] = color(255, 255, 255, 0);
    }
  }
  buff.updatePixels();

  // Draw buffer to canvas
  buff.endDraw();
  image(buff, 0, 0);
  buff.clear();
}

void draw() {
  // Leave empty if not using the draw loop for animations
}
