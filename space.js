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
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1;

//bullets 
let bulletArray = [];
let bulletVelocityY = -10;

let score = 0;
let gameOver = false;

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

  alienImg = new Image();
  alienImg.src = "./alien.png";
  createAliens();

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveship);
  document.addEventListener("keyup", shoot);
};

function update() {
   requestAnimationFrame(update);

   if(gameOver){
      return;
   }

   context.clearRect(0, 0, board.width, board.height);

   //ship
   context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

   //alien
   for (let i = 0; i < alienArray.length; i++){
      let alien = alienArray[i];
      if(alien.alive){
         alien.x += alienVelocityX;

         //if alien touches the borders
         if (alien.x + alien.width >= board.width || alien.x <= 0) {
            alienVelocityX *= -1;
            alien.x += alienVelocityX*2;

         //move all aliens up by one row 
         for(let j = 0; j < alienArray.length; j++){
            alienArray[j].y += alienHeight;
         }
         }
         context.drawImage(alienImg, alien.x , alien.y, alien.width, alien.height);

         if(alien.y >= ship.y){
            gameOver = true;
         }
      }
   }

   //bullets 
   for(let i = 0; i < bulletArray.length; i++){
      let bullet = bulletArray[i];
      bullet.y += bulletVelocityY;
      context.fillStyle= "white";
      context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

      //bullet collision with aliens 
      for(let j = 0; j < alienArray.length; j++) {
          let alien = alienArray[j];
          if (!bullet.used && alien.alive && detectCollision(bullet,alien)){
            bullet.used = true;
            alien.alive = false;
            alienCount --;
            score += 100;
          }
      }
   }

   //clear bullets
   while(bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){
      bulletArray.shift();
   }

   //next level 
   if(alienCount == 0){
      //increase the number of aliens in rows and columns by 1 
      alienColumns = Math.min(alienColumns + 1, columns/2 -2 );
      alienRows = Math.min(alienRows +1, rows-4);
      alienVelocityX += 0.2;
      alienArray = [];
      bulletArray = [];
      createAliens();
   }

   //score
   context.fillStyle="white";
   context.font="16px courier";
   context.fillText(score, 5, 20);


}

function moveship(e) {
   if (gameOver){
      return;
   }
   if (e.code ==  "ArrowLeft" && ship.x - shipVelocityX >= 0) {
      ship.x -= shipVelocityX;
   }
   else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width){
      ship.x += shipVelocityX;
   }
}

function createAliens(){
   for(let c = 0; c < alienColumns; c++){
      for (let r =0; r < alienRows; r++){
         let alien = {
            img : alienImg,
            x : alienX + c*alienWidth,
            y : alienY + r*alienHeight,
            width : alienWidth,
            height : alienHeight,
            alive : true
         }
         alienArray.push(alien);
      }
   }
   alienCount = alienArray.length;
}

function shoot(e){
   if(gameOver){
      return;
   }

   if(e.code == "Space"){
      //shoot
      let bullet = {
         x : ship.x + shipWidth*15/32,
         y : ship.y,
         width : tileSize/8,
         height : tileSize/2,
         used : false
      }
      bulletArray.push(bullet);
   }
}

function detectCollision(a, b){
   return a.x < b.x + b.width && 
          a.x + a.width > b.x && 
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
}