let size = 20;
let w = size * Math.sqrt(3);
let h = size * 2; // Declaring size of the hexagons
let canvasDiag = 30; // Declaring number of hexagons
let startClicked = false;
let started = false;

class hex{ //The class of each hexagon
  constructor(row,col,x,y,size){
    this.row = row;
    this.col = col;
    this.x = x;
    this.y = y;
    this.parentList = [];
    this.lastParent = 0;
    this.pos = createVector(this.x,this.y);
    this.size = size;
    this.open = false;
    this.closed = false;
    if (this.row == 0 || this.row == canvasDiag - 1 || this.col == 0 || this.col == canvasDiag - 1){
      this.isObstruction = true;
    }else{
      this.isObstruction = false;
    }
    this.isParent = false;
    this.isStart = false;
    this.isEnd = false;
    this.isCurrent = false;
    this.gcost = start.dist(this.pos);
    this.hcost = end.dist(this.pos);
    this.fcost = this.hcost + this.gcost;
  }
  calculateCost(){//for the accurate A* - distance must be updated by path of lowest cost real value
    this.gcost = p5.Vector.sub(this.pos,start).mag();
    this.hcost = p5.Vector.sub(this.pos,end).mag();
    this.fcost = this.hcost + this.gcost;
  }
  show(){
    if(this.isObstruction == true){
      fill('rgba(0,0,0,1)');
      polygon(this.x, this.y, size, 6);
    }else{
      if(this.isParent == true){
        fill('rgba(0,255,0,1)');
        polygon(this.x, this.y, size, 6);
      }else{
        if(this.isCurrent == true){
          fill('rgba(255,0,255,1)');
          polygon(this.x, this.y, size, 6);
        }else{
          if (this.isStart == true){
            fill('rgba(0,255,255,1)');
            polygon(this.x, this.y, size, 6);
          }else{
            if (this.isEnd == true){
              fill('rgba(255,255,0,1)');
              polygon(this.x, this.y, size, 6);
            }else{
              if(this.closed == true){
                fill('rgba(255,0,0,1)');
                polygon(this.x, this.y, size, 6);
              }else{
                if(this.open == true){
                  fill('rgba(255,128,0,1)')
                  polygon(this.x, this.y, size, 6);
                }else{
                  fill('rgba(0,0,255,1)')
                  polygon(this.x, this.y, size, 6);
                }
              }
            }
          }
        }
      }
    }
  } 
}

class hexGrid{ // The class of the grid.
  constructor(){
    this.hexes = [];
    for (var i = 0; i < canvasDiag; i++){
      this.hexes[i] = [];
    }
    this.hexesOpen = [];
    this.hexesClosed = [];
    this.current = new hex(0,0,0,0);
  }
  newHex(row,col,tempX,tempY,tempSize){
    var hexSingular = new hex(row,col,tempX,tempY,tempSize);
    this.hexes[row][col] = hexSingular;
  }
  openHex(row,col){
    this.hexes[row][col].open = true;
  }
  closeHex(row,col){
    this.hexes[row][col].open = false;
    this.hexes[row][col].closed = true;
  }
  updateCurrent(){ //removes and from open and closes it
    var lowestfcost = this.hexesOpen[0].fcost;
    this.current = this.hexesOpen[0];
    for (var i = 0; i < this.hexesOpen.length; i++){
      if (this.hexesOpen[i].fcost < lowestfcost){
        lowestfcost = this.hexesOpen[i].fcost;
        this.current = this.hexesOpen[i];
      }
    }
    this.hexesClosed.push(this.current);
    var indexCuInHexes = this.hexes.indexOf(this.current);
    this.hexes[this.current.row][this.current.col].closed = true;
    this.hexes[this.current.row][this.current.col].open = false;
    //var indexCuInOpen = this.hexesOpen.indexOf(this.current);
    //this.hexesOpen.splice(indexCuInOpen,1);
    this.hexes[this.current.row][this.current.col].isCurrent = false;
    var neighbours = [];
    if (this.current.col % 2 == 0){
      neighbours.push(this.hexes[this.current.row - 1][this.current.col - 1]);
      neighbours.push(this.hexes[this.current.row][this.current.col - 1]);
      neighbours.push(this.hexes[this.current.row - 1][this.current.col]);
      neighbours.push(this.hexes[this.current.row + 1][this.current.col]);
      neighbours.push(this.hexes[this.current.row - 1][this.current.col + 1]);
      neighbours.push(this.hexes[this.current.row][this.current.col + 1]);
        }else{
          neighbours.push(this.hexes[this.current.row][this.current.col - 1]);
          neighbours.push(this.hexes[this.current.row + 1][this.current.col - 1]);
          neighbours.push(this.hexes[this.current.row - 1][this.current.col]);
          neighbours.push(this.hexes[this.current.row + 1][this.current.col]);
          neighbours.push(this.hexes[this.current.row][this.current.col + 1]);
          neighbours.push(this.hexes[this.current.row + 1][this.current.col + 1]);
        }
    for (var n = 0; n < neighbours.length; n++){
      if (this.hexesOpen.includes(neighbours[n]) || this.hexesClosed.includes(neighbours[n])){
      }else{
        this.hexesOpen.push(neighbours[n]);
        this.hexes[neighbours[n].row][neighbours[n].col].lastParent = this.current;
        for (var c = 0; c < this.current.parentList.length; c++){
          this.hexes[neighbours[n].row][neighbours[n].col].parentList.push(this.current.parentList[c]);
        }
        this.hexes[neighbours[n].row][neighbours[n].col].parentList.push(this.current);
        this.hexes[neighbours[n].row][neighbours[n].col].open = true;
      }
    }
    for (i = 0; i < canvasDiag; i++){
      for (j = 0; j <canvasDiag; j++){
        this.hexes[i][j].isCurrent = false;
      }
    }
    this.hexes[this.current.row][this.current.col].isCurrent = true;
    for (i = 0; i < canvasDiag; i++){
      for (j = 0; j <canvasDiag; j++){
        if(this.hexes[i][j].isCurrent == false){
            this.hexes[i][j].isParent = false;
           }else{
             for (var p = 0; p < this.hexes[i][j].parentList.length; p++ ){
               this.hexes[this.hexes[i][j].parentList[p].row][this.hexes[i][j].parentList[p].col].isParent = true;
             }
             i = j = canvasDiag;
             break;
           }
      }
    }
  }
  removeCurrent(){
    if (this.hexesClosed.includes(this.current)){
      var indexCuInOpen = this.hexesOpen.indexOf(this.current);
      this.hexesOpen.splice(indexCuInOpen,1)
      this.hexes[this.current.row][this.current.col].open = false;
    }
  }
  createObstruction(){
    var mouseVector = createVector(mouseX,mouseY);
    var closestHexRow = 0;
    var closestHexCol = 0;
    var lowestdist = 100;
    for (i = 0; i < canvasDiag; i++){
      for (j = 0; j <canvasDiag; j++){
        if(this.hexes[i][j].isObstruction == true){
          this.hexesClosed.push(this.hexes[i][j])
        }
        var tempDist = this.hexes[i][j].pos.dist(mouseVector);
        if (tempDist < lowestdist){
          lowestdist = tempDist;
          closestHexRow = this.hexes[i][j].row;
          closestHexCol = this.hexes[i][j].col;
        }
      }
    }
    this.hexes[closestHexRow][closestHexCol].isObstruction = true;
    this.hexesClosed.push(this.hexes[closestHexRow][closestHexCol]);
  }
}
  

function setup() {
  createCanvas(windowWidth, windowHeight);
  startButton = createButton("SOLVE");
  startButton.size(100,100);
  startButton.position(windowWidth - 100,0);
  startButton.mousePressed(startPressed);
  startX = createInput('start x coord (1-28)')
  startX.position(windowWidth - 500,0)
  startY = createInput('start y coord(1-28)')
  startY.position(windowWidth - 500, 50)
  endX = createInput('end x coord(1-28)');
  endX.position(windowWidth - 500, 200);
  endY = createInput('end y coord(1-28))');
  endY.position(windowWidth - 500, 250);
  submitButton = createButton('submit');
  submitButton.position( windowWidth - 500, 300);
  submitButton.mousePressed(saveStartEnd);
  frameRate(60);
  //start = createVector(2 * w,2 * h * 0.75);//remember the positions are shifted if odd - use odd formula.
  //end = createVector((0.5 * w) + 25 * w ,25 * h * 0.75);
  
}

function draw() {
  background(220);
  if (started == true){
    for (i = 0; i < canvasDiag; i++){
      for (j = 0; j <canvasDiag; j++){
        theGrid.hexes[i][j].show();
      }
    }
    if(mouseIsPressed){
      theGrid.createObstruction()
      }
    if (frameCount % 2 == 1 && startClicked == true){ //to delay this function so that start is in open
      if(theGrid.current.isEnd == false){
        //try{
          theGrid.updateCurrent();
          theGrid.removeCurrent();
          //console.log(theGrid.hexesOpen);
          //console.log(theGrid.hexesClosed);
        }
        //catch(TypeError){
         // console.log("theres been TypeError")
        //}

      //}
    }
  }
}

function startPressed(){
  startClicked = true;
}
function saveStartEnd(){
  const sX = int(startX.value());
  const sY = int(startY.value());
  const eX = int(endX.value());
  const eY = int(endY.value());
  if (sY % 2 == 0){
    start = createVector(sX * w,sY * h * 0.75);
  }else{
    start = createVector((0.5 * w) + sX * w ,sY * h * 0.75);
    }
  if (eY % 2 == 0){
    end = createVector(eX * w,eY * h * 0.75);
  }else{
    end = createVector((0.5 * w) + eX * w ,eY * h * 0.75);
    }
  //console.log(start)
  
  theGrid = new hexGrid();
  for (i = 0; i < canvasDiag; i++){
    for (j = 0; j <canvasDiag; j++){
      if (j % 2 == 0){
        theGrid.newHex(i, j, i * w, j * h * 0.75, w, h);
          }else{
            theGrid.newHex(i, j, (0.5 * w) + i * w, j * h * 0.75, w, h);
          }
      if (theGrid.hexes[i][j].pos.equals(start)){
        theGrid.hexes[i][j].isStart = true;
        theGrid.hexes[i][j].open = true;
        theGrid.hexesOpen[0] = theGrid.hexes[i][j];
        }else{
          if (theGrid.hexes[i][j].pos.equals(end)){
            theGrid.hexes[i][j].isEnd = true;
            }
          }
    }
  }
  started = true;
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
