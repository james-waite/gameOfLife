let w, cg, camera, columns, rows, board, next, neighbors, initButton;

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  angleMode(DEGREES);

  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  graphics = createGraphics(720, 400);

  // for xy grid and axis
  // debugMode();

  // Create camera
  camera = createCamera();
  camera.move(0, -250, 150, 0, 0, 0);
  camera.lookAt(0, 0, 0);

  // Create init button
  initButton = createButton('INIT');
  initButton.class('button');
  initButton.mouseClicked(init);

  // resolution of Game of Life simulation
  w = 20;

  // Calculate columns and rows w/ resolution
  columns = floor(graphics.width / w);
  rows = floor(graphics.height / w);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

function draw() {
  background(25);
  graphics.background(0);
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] == 1) {
        graphics.fill(255);
        drawPavement(i, j); // draws a green dot over every 'on' square
      } else if (board[i][j] == 1 && neighbors > 2) {
        drawTrichome(i, j); // draws trichome
        console.log('trichome: ' + i + ', ' + j);
      } else if (board[i][j] == 0 && neighbors > 3) {
        drawStomata(i, j);
      } else graphics.fill(0);
      graphics.stroke(0);
      graphics.rect(i * w, j * w, w - 1, w - 1);
    }
  }

  push();
  rotateX(90);
  tint(255, 50);
  texture(graphics);
  noStroke();
  plane(720, 400);
  pop();

  // drawTrichome();
  // drawStomata();
  // drawPavement();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function mouseDragged() {
  // setting up the camera
  orbitControl(0.3, 0.3, 0.5);
}

function drawPavement(x, y) {
  push();
  translate(-graphics.width / 2 + w / 2, 0, -graphics.height / 2 + w / 2);
  strokeWeight(4);
  stroke('limegreen');
  point(x * 20, -5, y * 20);
  pop();
}

function drawTrichome() {
  push();
  // drawingContext.shadowBlur = 50;
  // drawingContext.shadowColor = 'green';
  strokeWeight(4);
  stroke('limegreen');
  point(30, -10, 20);
  point(35, -18, 15);
  point(32, -30, 18);
  point(34, -35, 12);
  pop();
}

function drawStomata() {
  push();
  strokeWeight(4);
  stroke('limegreen');
  point(i - 10, 5, j);
  point(i, 5, 10 + j);
  point(10 + i, 5, j);
  point(i, 5, j - 10);
  pop();
}

// reset board when mouse is pressed
// function mousePressed() {
//   init();
// }

// Fill board randomly
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1)
        board[i][j] = 0;
      // Filling the rest randomly
      else board[i][j] = floor(random(2));
      next[i][j] = 0;
    }
  }
}

// The process of creating the new generation
function generate() {
  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x + i][y + j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];

      // Rules of Life
      if (board[x][y] == 1 && neighbors < 2) next[x][y] = 0; // Loneliness
      else if (board[x][y] == 1 && neighbors > 3)
        next[x][y] = 0; // Overpopulation
      else if (board[x][y] == 0 && neighbors == 3)
        next[x][y] = 1; // Reproduction
      else next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap!
  let temp = board;
  board = next;
  next = temp;
}
