const width = 720;
const height = width;
const numberOfPins=100;
const loomRadius=320;
const loom = new Loom(loomRadius, numberOfPins)
let linesCanvas;
let img;
let maskImage;
let flag = 0;
let sumReference;
let steps = [0]
let lowestDifference = (loomRadius*2*4*255)**2;
let lowestDifferencePoint = 0;
let currentDifference;

function preload(){
  img = loadImage("../assets/cat.jpg");
  console.log("image loaded")
}
function setup(){
  createCanvas(width*2,height);
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
  sumReference = getSumOfImage(img);
  console.log("calculated reference image sum");
}
function draw(){
  console.log(steps.concat(flag))
  background(100,0,70);

  push()
  translate(width, 0);
  image(img, width/2-loomRadius, height/2-loomRadius, img.width*2, img.height*2);
  pop()

  image(linesCanvas, width/2-loomRadius, height/2-loomRadius, linesCanvas.width, linesCanvas.height);
  translate(width/2, height/2);

  loom.drawPoints();
  linesCanvas.background(255)
  loom.drawLines(steps.concat(flag));
  
  currentDifference =compare(linesCanvas, sumReference);
  if (currentDifference < lowestDifference){
    lowestDifference = currentDifference;
    lowestDifferencePoint = flag;
    //console.log(`found lowest ${lowestDifferencePoint}`)
  } /*else {
    console.log(`current: ${currentDifference} lowest: ${lowestDifference}`)
  }*/
  flag++;
  if(flag>numberOfPins-1){
    flag=0;
    console.log(`best pin is ${lowestDifferencePoint}`)
    steps.push(lowestDifferencePoint)
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
function getSumOfImage(input){
  input.loadPixels();
  return input.pixels.reduce((a, b) => a + b, 0);
}
function compare(lines, sumReference){
  const sumLines = getSumOfImage(lines);
  return sumLines - (sumReference*4);
}
