let r = 0;
let boxSize = 150;

function setup() {
  createCanvas(720, 400, WEBGL);
  graphics = createGraphics(boxSize, boxSize);
  graphics.background(150);
}

function draw() {
  background(50);

  r = map(mouseX, 0, 400, 0, 255);
  graphics.noStroke();
  graphics.fill(r, 0, 255 - r);
  graphics.ellipse(
    map(mouseX, 0, width, 0, boxSize),
    map(mouseY, 0, height, 0, boxSize),
    boxSize / 4
  );

  rotateX(frameCount / 60);
  rotateY(frameCount / 60);
  rotateZ(frameCount / 60);
  texture(graphics);
  box(boxSize);
}
