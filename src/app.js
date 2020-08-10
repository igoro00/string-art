const width = 720;
const height = width;
const numberOfPins=100;
const loomRadius = 320;
const loom = new Loom(loomRadius, numberOfPins)
let img;
let maskImage;

function preload(){
  img = loadImage("../assets/cat.jpg");
  console.log("image loaded")
}
function setup(){
  createCanvas(width*2,height);
  maskImage = createGraphics(loomRadius*2, loomRadius*2);
  maskImage.background(0,0);
  maskImage.fill(255);
  maskImage.ellipse(loomRadius, loomRadius, loomRadius*2);
  console.log("mask created")
  mask(img, maskImage);
  console.log("mask applied")
  bw(img);
  console.log("bw filter applied")
}
function draw(){
  background(255);
  push()
  translate(width, 0);
  //img.mask(maskImage);
  image(img, width/2-loomRadius, height/2-loomRadius, img.width, img.height);
  pop()
  translate(width/2, height/2);
  loom.draw();
  loom.drawLine(0, 50);
}
function mask(i, m){
  i.loadPixels()
  m.loadPixels()
  for (let x = 0; x < i.width; x++) {
    for (let y = 0; y < i.height; y++) {
      const c = m.get(x,y)
      if(c[3]===0){i.set(x, y, c);}
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