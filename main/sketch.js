function setup() {
  createCanvas(800, 800);
  size = 20;
  w = size * Math.sqrt(3);
  h = size * 2
  canvasdiag = 20;
}

function draw() {
  background(220);
  for (i = 0; i < canvasdiag; i++){
    for (j = 0; j <canvasdiag; j++){
      if (j % 2 == 0){
        rect(i * w, j * h*0.75, w, h);
        fill('rgba(0,255,0, 0.1)')
          }else{
            rect((0.5 * w) + i * w, j * h*0.75, w, h);
            fill('rgba(0,255,0, 0.1)')
          }
    }
  }
}