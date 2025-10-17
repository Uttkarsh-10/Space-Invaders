//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardwidth = tileSize * columns;
let boardheight = tileSize * rows;
let context;

//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 1.5;

let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight
};

let shipImg;
let shipVelocityX = tileSize;

//aliens
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;

window.onload = function() {
  board = document.getElementById("board");
  board.width = boardwidth;
  board.height = boardheight;
  context = board.getContext("2d");

  // Load and draw ship
  shipImg = new Image();
  shipImg.src = "./ship.png";
  shipImg.onload = function() {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  };

  requestAnimationFrame(update);
  document.addEventListener("keydown",moveship);
};

function update() {
   requestAnimationFrame(update);

   context.clearRect(0, 0, board.width, board.height);

   //ship
   context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);


}

function moveship(e) {
   if (e.code ==  "ArrowLeft" && ship.x - shipVelocityX >= 0) {
      ship.x -= shipVelocityX;
   }
   else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width){
      ship.x += shipVelocityX;
   }
}