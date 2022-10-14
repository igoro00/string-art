function Loom(radius, numberOfPins) {
  this.radius = radius;
  this.pins = [];
  for (let i = 0; i < numberOfPins; i++) {
    const theta = (Math.PI * 2) / numberOfPins;
    const angle = theta * i - Math.PI / 2;
    this.pins.push(
      new Pin(this.radius * Math.cos(angle), this.radius * Math.sin(angle))
    );
  }
  this.drawPoints = () => {
    this.pins.forEach((pin) => {
      pin.draw(3);
    });
  };
  this.drawLines = (steps) => {
    for (let i = 1; i < steps.length; i++) {
      this.drawLine(steps[i - 1], steps[i]);
    }
  };
  this.drawLine = (startPinIndex, stopPinIndex, color = [0, 0, 0, 255]) => {
    linesCanvas.strokeWeight(1);
    linesCanvas.stroke(color[0], color[1], color[2], color[3]);
    linesCanvas.line(
      this.pins[startPinIndex].x,
      this.pins[startPinIndex].y,
      this.pins[stopPinIndex].x,
      this.pins[stopPinIndex].y
    );
  };
  this.draw = () => {
    // noFill();
    // stroke(0);
    // strokeWeight(1);
    // ellipse(0, 0, loomRadius * 2);
    this.drawPoints();
  };
  this.getRealStringLen = (steps, d) => {
    let output = 0;
    for (let i = 1; i < steps.length; i++) {
      const x1 = this.pins[steps[i - 1]].x;
      const y1 = this.pins[steps[i - 1]].y;
      const x2 = this.pins[steps[i]].x;
      const y2 = this.pins[steps[i]].y;
      output += sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    return (output * d) / (loomRadius * 2);
  };
}
