const width = 720;
const height = width;
const numberOfPins = 50;
const loomRadius = 320;
const chunks = 64;
const loom = new Loom(loomRadius, numberOfPins);

let fpsTracker;
let linesCountTracker;
let fitnessTracker;
let stepsTracker;
let bestMovesTracker;

let realLoomDiameter = 1; //diameter in metres

let linesCanvas;
let img;
let maskImage;
let currentPin = 0;
let sumReference;
let steps = [0];
let bestMoves = [];
let lowestDifference;

function preload() {
  img = loadImage("../test.jpg");
  console.log("image loaded");
}
function setup() {
  createCanvas(width * 2, height);
  fpsTracker = createElement("p", "0fps");
  linesCountTracker = createElement("p", "0 lines");
  fitnessTracker = createElement("p", "255 fitness");
  stepsTracker = createElement("p", "Steps []");
  bestMovesTracker = createElement("p", "[]");

  linesCanvas = createGraphics(loomRadius * 2, loomRadius * 2);
  linesCanvas.translate(loomRadius, loomRadius);
  maskImage = createGraphics(loomRadius, loomRadius);
  maskImage.background(0, 0);
  maskImage.fill(255);
  maskImage.ellipse(loomRadius / 2, loomRadius / 2, loomRadius);
  img.mask(maskImage);
  replaceColor(img, [0, 0, 0, 0], [255, 255, 255, 255]);
}

function draw() {
  fpsTracker.html(`${frameRate()} fps`);
  linesCountTracker.html(`${steps.length} lines`);
  fitnessTracker.html(`${lowestDifference} lowestDifference`);
  stepsTracker.html(`Steps: ${JSON.stringify(steps.concat(currentPin))}`);
  bestMovesTracker.html(`BestMoves: ${JSON.stringify(bestMoves)}`);

  background(100, 0, 70);

  push();
  translate(width, 0);
  image(
    img,
    width / 2 - loomRadius,
    height / 2 - loomRadius,
    img.width,
    img.height
  );
  pop();

  image(
    linesCanvas,
    width / 2 - loomRadius,
    height / 2 - loomRadius,
    linesCanvas.width,
    linesCanvas.height
  );

  push();
  translate(width / 2, height / 2);
  loom.draw();
  linesCanvas.background(255);
  loom.drawLines(steps.concat(currentPin));
  //check if it was a good move
  const difference = getDifference();
  if (difference < lowestDifference || lowestDifference == undefined) {
    lowestDifference = difference;
    bestMoves = [currentPin];
  } else if (difference === lowestDifference) {
    bestMoves.push(currentPin);
  }
  pop();
  if (currentPin >= numberOfPins - 1) {
    //get the best move so far and reset current pin
    steps.push(bestMoves.random());
    bestMoves = [];
    currentPin = 0;
  } else {
    currentPin++;
  }
}

function getDifference() {
  img.loadPixels();
  linesCanvas.loadPixels();
  let difference = 0;
  for (let i = 0; i < img.pixels.length; i++) {
    difference += Math.abs(img.pixels[i] - linesCanvas.pixels[i]);
  }
  return difference;
}

function replaceColor(i, sourceColor, destinationColor) {
  i.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      if (compareArrays(img.get(x, y), sourceColor)) {
        img.set(x, y, destinationColor);
      }
    }
  }
  i.updatePixels();
}

function compareArrays(a1, a2) {
  var i = a1.length;
  while (i--) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
}

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};
