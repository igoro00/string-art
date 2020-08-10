function Loom(radius, numberOfPins){
  this.radius = radius;
  this.pins =[];
  for(let i =0; i<numberOfPins;i++){
    const theta = ((Math.PI*2)/numberOfPins);
    const angle = (theta*i-Math.PI/2);
    this.pins.push(new Pin(this.radius*Math.cos(angle), this.radius*Math.sin(angle)));
  }
  this.drawPoints=()=>{
    this.pins.forEach(pin => {
      pin.draw(7);
    });
  }
  this.drawLine = (startPinIndex, stopPinIndex)=>{
    strokeWeight(1);
    stroke(255);
    line(this.pins[startPinIndex].x, this.pins[startPinIndex].y, this.pins[stopPinIndex].x,this.pins[stopPinIndex].y);
  }
  this.draw = ()=>{
    noFill();
    stroke(255);
    strokeWeight(1);
    ellipse(0, 0, loomRadius*2);
    this.drawPoints();
  }
}