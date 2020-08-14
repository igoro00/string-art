const width = 720;
const height = width;
const numberOfPins=500;
const loomRadius=320;
const chunks = 64
const loom = new Loom(loomRadius, numberOfPins)

let fpsTracker;
let linesCountTracker;
let fitnessTracker;
let realLengthTracker;

let realLoomDiameter = 1; //diameter in metres

let linesCanvas;
let img;
let maskImage;
let currentPin = 0;
let currentFrame = 0;
let sumReference;
let steps = [0]
let lowestDifference = (loomRadius*2*4*255)**2;
let lowestDifferencePoint = 0;
let currentDifference;

function preload(){
  img = loadImage("../assets/test/cat.jpg");
  console.log("image loaded")
}
function setup(){
  createCanvas(width*2,height);
  fpsTracker = createElement("p","0fps");
  linesCountTracker = createElement('p','0 lines');
  fitnessTracker = createElement('p','255 fitness');
  realLengthTracker = createElement('p','0 m');


  linesCanvas = createGraphics(loomRadius*2, loomRadius*2);
  linesCanvas.translate(loomRadius, loomRadius);
  maskImage = createGraphics(loomRadius, loomRadius);
  maskImage.background(0,0);
  maskImage.fill(255);
  maskImage.ellipse(loomRadius/2, loomRadius/2, loomRadius);
  console.log("mask created");
  bw(img);
  console.log("bw filter applied");
  mask(img, maskImage);
  console.log("mask applied");
  reference = getAvgOfPixels(splitImage(img, chunks))
  console.log("calculated reference image sum");
  
}
function draw(){
  for(let frameMult = 0; frameMult<2; frameMult++){
    if(currentFrame%20==0){
      fpsTracker.html(`${frameRate()} fps`);
      linesCountTracker.html(`${steps.length} lines`);
      fitnessTracker.html(`${lowestDifference} fitness`);
      realLengthTracker.html(`${loom.getRealStringLen(steps, realLoomDiameter)} metres`);
    }
    background(100,0,70);

    push()
    translate(width, 0);
    image(img, width/2-loomRadius, height/2-loomRadius, img.width*2, img.height*2);
    pop()

    image(linesCanvas, width/2-loomRadius, height/2-loomRadius, linesCanvas.width, linesCanvas.height);
    push();
    translate(width/2, height/2);
    //loom.drawPoints();
    linesCanvas.background(255)
    loom.drawLines(steps.concat(currentPin));
    pop();
    currentDifference =compare(linesCanvas, reference);
    if (currentDifference < lowestDifference){
      lowestDifference = currentDifference;
      lowestDifferencePoint = currentPin;
    }
    currentPin++;
    if(currentPin>numberOfPins-1){
      currentPin=0;
      steps.push(lowestDifferencePoint)
    }
    currentFrame++;
  }
}
function mask(i, m){
  i.loadPixels()
  m.loadPixels()
  for (let x = 0; x < i.width; x++) {
    for (let y = 0; y < i.height; y++) {
      const c = m.get(x,y)
      if(c[3]===0){i.set(x, y, [255,255,255,255]);}
    }
  }
  i.updatePixels()
}
function bw(img){
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      if(img.get(x,y)[3]!==0){
        avg=1.2*(img.get(x,y).slice(0,2).reduce((a, b) => a + b)/3)
        avg = avg>255?255:avg;
        img.set(x,y,[avg, avg, avg, 255])
      }
    }
  }
  img.updatePixels()
}
function getAvgOfPixels(input){
  /* returns array of averages of every chunk in the input */
  return input.map(elem=>elem.reduce((a, b) => a + b, 0)/elem.length);
}

function splitImage(input, n){
  input.loadPixels();
  let chunks = [];
  const chunkLenght = input.width/n; //lenght of the edge of the chunk in PIXELS
  for(let chunkY = 0; chunkY<n; chunkY++){
    let lineOfChunks = []
    for(let x = 0; x<n; x++){
      lineOfChunks.push([])
    }
    for(let y = 0; y<chunkLenght; y++){
      const startOfLine = ((chunkY*chunkLenght)+y)*(input.width*4);
      const endOfLine = startOfLine+(input.width*4);
      let i = 0;
      for(let x =startOfLine; x<endOfLine; x+=(chunkLenght*4)){
        lineOfChunks[i]=input.pixels.slice(x, x+(chunkLenght*4))
        i++;
      }
    }
    chunks = chunks.concat(lineOfChunks);
  }
  return chunks;
}

function getDiffs(a, b){
  let diffs = []
  for(let i = 0; i<a.length; i++){
    diffs.push(abs(a[i]-b[i]));
  }
  return diffs;
}
function compare(lines, reference){
  const differences = getDiffs(getAvgOfPixels(splitImage(lines, chunks)), reference);
  return differences.reduce((a, b) => a + b, 0)/differences.length;
}
