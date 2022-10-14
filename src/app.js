const width = 720;
const height = width;
const numberOfPins = 500;
const loomRadius = 320;
const chunks = 64;
const loom = new Loom(loomRadius, numberOfPins);

let fpsTracker;
let linesCountTracker;
let fitnessTracker;
let realLengthTracker;

let realLoomDiameter = 1; //diameter in metres

let linesCanvas;
let img;
let maskImage;
let currentPin = 0;
let sumReference;
let steps = [0];
let lowestDifference = (loomRadius * 2 * 4 * 255) ** 2;
let lowestDifferencePoint = 0;
let currentDifference;

function preload() {
  img = loadImage("../test.jpg");
  console.log("image loaded");
}
function setup() {
  createCanvas(width * 2, height);
  fpsTracker = createElement("p", "0fps");
  linesCountTracker = createElement("p", "0 lines");
  fitnessTracker = createElement("p", "255 fitness");
  realLengthTracker = createElement("p", "0 m");

  linesCanvas = createGraphics(loomRadius * 2, loomRadius * 2);
  linesCanvas.translate(loomRadius, loomRadius);
  maskImage = createGraphics(loomRadius, loomRadius);
  maskImage.background(0, 0);
  maskImage.fill(255);
  maskImage.ellipse(loomRadius / 2, loomRadius / 2, loomRadius);
  img.mask(maskImage);
  replaceColor(img, [0, 0, 0, 0], [255, 255, 255, 255]);

  setInterval(() => {
    fpsTracker.html(`${frameRate()} fps`);
    linesCountTracker.html(`${steps.length} lines`);
    fitnessTracker.html(`${lowestDifference} fitness`);
    realLengthTracker.html(
      `${loom.getRealStringLen(steps, realLoomDiameter)} metres`
    );
  }, 1000);
}

function draw() {
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

  pop();
  currentPin++;
}

function getDifference() {
  img.loadPixels();
  linesCanvas.loadPixels();
  currentDifference = 0;
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      currentDifference += Math.abs(
        img.get(x, y)[0] - linesCanvas.get(x, y)[0]
      );
    }
  }
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
