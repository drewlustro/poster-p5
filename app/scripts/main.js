var xspacing = 10;    // Distance between each horizontal location
var w;                // Width of entire wave
var theta = 0.0;      // Start angle at 0
var amplitude = 220.0; // Height of wave
var period = 500.0;   // How many pixels before the wave repeats
var dx;               // Value for incrementing x
var yvalues;  // Using an array to store height values for the wave
var numWaves = 4;

var canvasWidth = canvasHeight = 1000;
var halfWidth = canvasWidth / 2;
var halfHeight = canvasHeight / 2;
var ringRadius = canvasWidth / 4;
var now, nowNormal;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  w = width + xspacing;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w/xspacing));
}

function draw() {
  now = millis();
  // background(36, 198, 220); // teal
  // background(255);
  background(45);
  // background(0);
  // renderOutlineBall();
  fill();
  noStroke();
  calcWave();

  var waveOffset;
  var waveAmp;
  for (var i = 0; i < numWaves; i++) {
    waveOffset = (TWO_PI / numWaves) * i;
    waveAmp = (PI / numWaves) * i;
    renderWave(waveOffset, timeDiffNormal(
               timeDiffNormal(4000) * 500 + 2200) - 0.2);
  }
  // renderOutline();

}

function timeDiff(speed) {
  speed = speed || 2000;
  return now / speed;
}

function timeDiffNormal(speed) {
  speed = speed || 2000;
  return (cos(timeDiff(speed)) + 1.00001) / 2;
}

function translateToCenter(obj) {
  obj.translate(width / 2, height /2);
}

function renderOutline() {
  var txn = timeDiffNormal();
  noFill();
  stroke(150, 150, 150, 145 * txn + 140);
  ellipse(width/2, height/2, ringRadius * 2, ringRadius * 2);
}

function renderOutlineBall() {
  var x, y, ballSize;
  var tx = timeDiff(4000);
  ballSize = timeDiffNormal(850) * 400 + 1000;
  noStroke();
  fill(255, 255, 255, timeDiffNormal(20000) * 200 + 50);

  x = cos(tx) * ballSize/2 + halfWidth;
  y = sin(tx) * ballSize/2 + halfHeight;
  ellipse(x, y, ballSize, ballSize);

  // x = cos(-tx) * ballSize/2 + halfWidth;
  // y = sin(tx) * ballSize/2 + halfHeight;
  // ellipse(x, y, ballSize, ballSize);

  // x = cos(tx) * ballSize/2 + halfWidth;
  // y = sin(-tx) * ballSize/2 + halfHeight;
  // ellipse(x, y, ballSize, ballSize);


}

function calcWave() {
  // Increment theta (try different values for
  // 'angular velocity' here
  theta += 0.02;

  // For every x value, calculate a y value with sine function
  var x = theta;
  for (var i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude;
    x += dx;
  }
}

function renderWave(offset, amp) {
  offset = offset || 0;
  amp = amp || 1;
  noStroke();

  var a, b, angle, ampTotal, ylen;
  angle = TWO_PI / yvalues.length;
  // A simple way to draw the wave with an ellipse at each location
  ylen = yvalues.length;
  colorMode(HSB, ylen, ylen, ylen, angle);
  blendMode(SCREEN);
  for (var x = 0; x < yvalues.length; x++) {
    fill(25 + timeDiffNormal(600) * x, ylen, x, angle / 1.5);
    // fill(x, ylen, x, angle);
    ampTotal = (amp * (ringRadius + yvalues[x]));
    a = cos(x * angle + offset) * ampTotal + halfWidth;
    b = sin(x * angle + offset) * ampTotal + halfHeight;
    // ellipse(x * xspacing, height/2 + yvalues[x], 16, 16);
    ellipse(a, b, x / 2 + 6, x / 2 + 6);
  }

  colorMode(RGB);
}

// ADD - sum of A and B
// DARKEST - only the darkest colour succeeds: C = min(A*factor, B).
// LIGHTEST - only the lightest colour succeeds: C = max(A*factor, B).
// DIFFERENCE - subtract colors from underlying image.
// EXCLUSION - similar to DIFFERENCE, but less extreme.
// MULTIPLY - multiply the colors, result will always be darker.
// SCREEN - opposite multiply, uses inverse values of the colors.
// REPLACE - the pixels entirely replace the others and don't utilize alpha (transparency) values.
// OVERLAY - mix of MULTIPLY and SCREEN . Multiplies dark values, and screens light values.
// HARD_LIGHT - SCREEN when greater than 50% gray, MULTIPLY when lower.
// SOFT_LIGHT - mix of DARKEST and LIGHTEST. Works like OVERLAY, but not as harsh.
// DODGE - lightens light tones and increases contrast, ignores darks.
// BURN - darker areas are applied, increasing contrast, ignores lights.
