//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardwidth = tileSize * columns;
let boardheight = tileSize * rows;
let context;

//ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize/2;

let ship = {
   x : shipX,
   y : shipY,
   width : shipWidth,
   height : shipHeight
}

window.onload = function() {
   board = document.getElementById("board");
   board.width = boardWidth;
   board.height = boardHeight;
   context = board.getContext("2d");

   // draw initial ship
   context.fillstyle="green";
}