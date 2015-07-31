var Wavves = function () {
  this.message = 'Wavves';
  this.defaultSpeed = 15;

  this.xspacing = 9;
  this.amplitude = 370;
  this.period = 790;
  this.numWaves = 4;

  this.colorMode = 'hsb';
  this.blendMode = 'hard-light';
  this.baseColor = { h:60, s:0.25, v:1.0 };
  this.clearColor = [255, 255, 255];
};


var wvs, gui, controller, controllerXSpacing, controllerPeriod;

var canvasWidth = canvasHeight = 1000;
var halfWidth = canvasWidth / 2;
var halfHeight = canvasHeight / 2;
var ringRadius = canvasWidth / 4;

var w, theta, dx, yvalues;

wvs = new Wavves();

theta = 0.0;
w = canvasWidth + wvs.xspacing;
dx = ((Math.PI * 2) / wvs.period) * wvs.xspacing;
yvalues = new Array(Math.floor(w / wvs.xspacing));

window.onload = function () {

  gui = new dat.GUI();
  gui.add(wvs, 'message').listen();
  controller = gui.add(wvs, 'defaultSpeed', 1, 100).step(1).listen();
  gui.add(wvs, 'numWaves', 1, 10).step(1).listen();
  controllerXSpacing = gui.add(wvs, 'xspacing', 1, 20).step(1).listen();
  controllerPeriod = gui.add(wvs, 'period', 50, 1000).step(5).listen();
  gui.add(wvs, 'amplitude', 50, 1000).step(5).listen();

  gui.addColor(wvs, 'baseColor').listen();
  gui.addColor(wvs, 'clearColor').listen();

  gui.add(wvs, 'colorMode', {
    'HSB': 'hsb',
    'RGB': 'rgb'
  }).listen();

  // Description
  // Blends the pixels in the display window according to the defined mode. There is a choice of the following modes to blend the source pixels (A) with the ones of pixels already in the display window (B):
  gui.add(wvs, 'blendMode', {
      'BLEND': 'normal', // - linear interpolation of colours: C = A*factor + B. This is the default blending mode.
      'DARKEST': 'darken', // - only the darkest colour succeeds: C = min(A*factor, B).
      'LIGHTEST': 'lighten', // - only the lightest colour succeeds: C = max(A*factor, B).
      'DIFFERENCE': 'difference', // - subtract colors from underlying image.
      'EXCLUSION': 'exclusion', // - similar to DIFFERENCE, but less extreme.
      'MULTIPLY': 'multiply', // - multiply the colors, result will always be darker.
      'SCREEN': 'screen', // - opposite multiply, uses inverse values of the colors.
      'REPLACE': 'source-over', // - the pixels entirely replace the others and don't utilize alpha (transparency) values.
      'OVERLAY': 'overlay', // - mix of MULTIPLY and SCREEN . Multiplies dark values, and screens light values.
      'HARD_LIGHT': 'hard-light', // - SCREEN when greater than 50% gray, MULTIPLY when lower.
      'SOFT_LIGHT': 'soft-light', // - mix of DARKEST and LIGHTEST. Works like OVERLAY, but not as harsh.
      'DODGE': 'color-dodge', //  lightens light tones and increases contrast, ignores darks.
      'BURN': 'color-burn' // - darker areas are applied, increasing contrast, ignores lights.
  }).listen();



  controller.onChange(function(value) {
    console.log('New defaultSpeed is:', value);
  });

  controllerXSpacing.onFinishChange(function(value) {
    initialize();
  });

  controllerPeriod.onFinishChange(function(value) {
    initialize();
  });
}


// var xspacing = 16;    //  Distance between each horizontal location
// var w;                // Width of entire wave
// var theta = 0.0;      // Start angle at 0
// var wvs.amplitude = 220.0; // Height of wave
// var wvs.period = 500.0;   // How many pixels before the wave repeats
// var wvs.amplitude = 420.0; // Height of wave
// var period = 680.0;   // How many pixels before the wave repeats
// var dx;               // Value for incrementing x
// var yvalues;  // Using an array to store height values for the wave
// var numWaves = 4;

function initialize() {
  theta = 0.0;
  w = canvasWidth + wvs.xspacing;
  dx = ((Math.PI * 2) / wvs.period) * wvs.xspacing;
  yvalues = new Array(Math.floor(w / wvs.xspacing));
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initialize();
}

function draw() {
  now = millis();
  // background(36, 198, 220); // teal
  // background(230);
  background(wvs.clearColor);
  // background(0);
  // background(0);
  // renderOutlineBall();
  fill();
  noStroke();
  calcWave();

  var waveOffset;
  var waveAmp;
  for (var i = 0; i < wvs.numWaves; i++) {
    waveOffset = (TWO_PI / wvs.numWaves) * i;
    waveAmp = (PI / wvs.numWaves) * i;
    renderWave(waveOffset);
    // renderWave(waveOffset, timeDiffNormal(
               // timeDiffNormal(4000) * 500 + 2200) - 0.06);
  }
  // renderOutline();

}

function timeDiff(speed) {
  speed = speed || 2000;
  speed *= (wvs.defaultSpeed / 10);
  return now / speed;
}

function timeDiffNormal(speed) {
  // console.log('default speed:', wvs.defaultSpeed);
  speed = speed || 2000;
  speed *= (wvs.defaultSpeed / 10);
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
  fill(255, 255, 255, timeDiffNormal(20000) * 100 + 50);

  x = cos(tx) * ballSize/2 + halfWidth;
  y = sin(tx) * ballSize/2 + halfHeight;
  ellipse(x, y, ballSize, ballSize);

  // x = cos(-tx) * ballSize/2 + halfWidth;
  // y = sin(tx) * ballSize/2 + halfHeight;
  // ellipse(x, y, ballSize, ballSize);

  x = cos(tx) * ballSize/2 + halfWidth;
  y = sin(-tx) * ballSize/2 + halfHeight;
  ellipse(x, y, ballSize, ballSize);


}

function calcWave() {
  // Increment theta (try different values for
  // 'angular velocity' here
  theta += 0.02;

  // For every x value, calculate a y value with sine function
  var x = theta;
  for (var i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * wvs.amplitude;
    x += dx;
  }
}

function renderWave(offset, amp) {
  offset = offset || 0;
  amp = amp || 1;
  if (amp < 0.5) {
    amp = 0.5;
  } else if (amp > 2) {
    amp = 2;
  }
  noStroke();

  var a, b, angle, ampTotal, ylen;
  angle = TWO_PI / yvalues.length;
  // A simple way to draw the wave with an ellipse at each location
  ylen = yvalues.length;
  colorMode(wvs.colorMode, ylen, 1, 1, angle);
  blendMode(wvs.blendMode);
  for (var x = 0; x < yvalues.length; x++) {
    if (wvs.colorMode == HSB) {
      fill(wvs.baseColor.h + timeDiffNormal(800) * x, wvs.baseColor.s, wvs.baseColor.v * x / ylen);
    } else {
      fill(wvs.baseColor.h, wvs.baseColor.s, wvs.baseColor.v, angle)
    }
    // fill(25 + timeDiffNormal(800) * x, 0, x / 2 + (ylen / 2), angle / 1.5);
    // fill((x+1)/2 + ylen/2, 0, 25 + timeDiffNormal(800) * x, angle/2 + angle/2);
    // fill(x, ylen, x, angle);
    ampTotal = (amp * (ringRadius/3 + yvalues[x]));
    a = cos(x * angle + offset) * ampTotal + halfWidth;
    b = sin(x * angle + offset) * ampTotal + halfHeight;
    // ellipse(x * wvs.xspacing, height/2 + yvalues[x], 16, 16);
    ellipse(a, b, x / 3 + 24, x / 3 + 24);
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
