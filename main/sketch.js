size = 20;
w = size * Math.sqrt(3);
h = size * 2;
canvasDiag = 20;

class hex{
  constructor(x,y,size){
    this.x = x;
    this.y = y;
    this.size = size;
  }
  show(){
    fill('rgba(0,255,0, 0.1)');
    //rect(this.x, this.y, w, h)
    polygon(this.x, this.y, size, 6);
  }
}

class hexGrid{
  constructor(){
    this.hexes = [];
    for (var i = 0; i < canvasDiag; i++){
      this.hexes[i] = [];
    }
  }
  newHex(row,col,tempX,tempY,tempSize){
    var hexSing = new hex(tempX,tempY,tempSize);
    this.hexes[row][col] = hexSing;
    this.hexes[row][col].show();
  }
}
  

function setup() {
  createCanvas(800, 800);
  theGrid = new hexGrid();
}

function draw() {
  background(220);
  for (i = 0; i < canvasDiag; i++){
    for (j = 0; j <canvasDiag; j++){
      if (j % 2 == 0){
        theGrid.newHex(i, j, i * w, j * h * 0.75, w, h)
          }else{
            theGrid.newHex(i, j, (0.5 * w) + i * w, j * h * 0.75, w, h)
          }
    }
  }
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = (PI/6); a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}