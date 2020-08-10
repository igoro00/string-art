const width = 960;
const height = width;
const numberOfPins=100;
const loomRadius = 0.40*width;

const loom = new Loom(loomRadius, numberOfPins)
function setup(){
  createCanvas(width,height);
}
function draw(){
  background(0);
  translate(width/2, height/2);
  loom.draw();
  loom.drawLine(0, 50);
}