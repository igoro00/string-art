function Pin(x,y,id, s){
  this.x = x;
  this.y = y;
  this.id = y;
  this.draw = (strokeW)=>{
    strokeWeight(strokeW)
    point(this.x, this.y)
  }
}