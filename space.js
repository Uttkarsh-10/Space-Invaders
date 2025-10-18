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
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1;
let level = 1;

//bullets 
let bulletArray = [];
let bulletVelocityY = -10;

let score = 0;
let gameOver = false;

// Restart button element
let resetButton;

window.onload = function () {
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column";
  document.body.style.alignItems = "center";
  document.body.style.backgroundColor = "black";
  document.body.style.color = "white";
  document.body.style.fontFamily = "Courier";
  document.body.style.textAlign = "center";

  board = document.getElementById("board");
  board.width = boardwidth;
  board.height = boardheight;
  context = board.getContext("2d");

  const instructions = document.createElement("div");
  instructions.innerHTML = `
    <p style="margin: 10px 0; font-size: 18px; color: #00ffcc;">
      <b>CONTROLS:</b><br>
      ⬅️ <b>Left Arrow</b> – Move Left &nbsp;&nbsp;
      ➡️ <b>Right Arrow</b> – Move Right &nbsp;&nbsp;
      🔫 <b>Spacebar</b> – Shoot
    </p>
  `;
  document.body.insertBefore(instructions, board);

  // create reset button (hidden at start)
  resetButton = document.createElement("button");
  resetButton.innerText = "Restart Game";
  resetButton.style.marginTop = "20px";
  resetButton.style.padding = "12px 28px";
  resetButton.style.fontSize = "24px";
  resetButton.style.backgroundColor = "#ff4444";
  resetButton.style.color = "white";
  resetButton.style.border = "none";
  resetButton.style.borderRadius = "10px";
  resetButton.style.cursor = "pointer";
  resetButton.style.display = "none";
  resetButton.style.position = "relative";
  resetButton.style.left = "0";
  resetButton.style.alignSelf = "center"; // ✅ center button horizontally

  // add reset button below the canvas
  document.body.appendChild(resetButton);
  resetButton.addEventListener("click", resetGame);

  // Load and draw ship
  shipImg = new Image();
  shipImg.src = "./ship.png";
  shipImg.onload = function () {
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

  context.clearRect(0, 0, board.width, board.height);

  if (gameOver) {
    // show "GAME OVER" text at top
    context.fillStyle = "red";
    context.font = "36px Courier";
    context.textAlign = "center";
    context.fillText("GAME OVER", board.width / 2, 60);

    resetButton.style.display = "block"; // show reset button
    return;
  }

  //ship
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  //aliens
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVelocityX;

      //if alien touches the borders
      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVelocityX *= -1;
        alien.x += alienVelocityX * 2;

        //move all aliens down by one row 
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienHeight;
        }
      }

      // draw alien
      context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

      // if alien touches ship
      if (
        alien.y + alien.height >= ship.y &&
        alien.x < ship.x + ship.width &&
        alien.x + alien.width > ship.x
      ) {
        gameOver = true;
      }
    }
  }

  //bullets 
  for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    context.fillStyle = "white";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    //bullet collision with aliens 
    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
        bullet.used = true;
        alien.alive = false;
        alienCount--;
        score += 100;
      }
    }
  }

  //clear bullets
  while (
    bulletArray.length > 0 &&
    (bulletArray[0].used || bulletArray[0].y < 0)
  ) {
    bulletArray.shift();
  }

  //next level 
  if (alienCount == 0) {
    level++;
    //increase difficulty after every level
    alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
    alienRows = Math.min(alienRows + 1, rows - 4);
    alienVelocityX *= 1.25; // 🚀 increase speed by 25% each level
    alienArray = [];
    bulletArray = [];
    createAliens();
  }

  //score and level display
  context.fillStyle = "white";
  context.font = "16px Courier";
  context.textAlign = "left";
  context.fillText("Score: " + score, 10, 25);
  context.fillText("Level: " + level, 10, 45);
}

function moveship(e) {
  if (gameOver) return;

  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX;
  } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
    ship.x += shipVelocityX;
  }
}

function createAliens() {
  for (let c = 0; c < alienColumns; c++) {
    for (let r = 0; r < alienRows; r++) {
      let alien = {
        img: alienImg,
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true
      };
      alienArray.push(alien);
    }
  }
  alienCount = alienArray.length;
}

function shoot(e) {
  if (gameOver) return;

  if (e.code == "Space") {
    let bullet = {
      x: ship.x + shipWidth * 15 / 32,
      y: ship.y,
      width: tileSize / 8,
      height: tileSize / 2,
      used: false
    };
    bulletArray.push(bullet);
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Reset the game
function resetGame() {
  gameOver = false;
  score = 0;
  level = 1;
  alienRows = 2;
  alienColumns = 3;
  alienVelocityX = 1;
  bulletArray = [];
  alienArray = [];

  ship.x = tileSize * columns / 2 - tileSize;
  ship.y = tileSize * rows - tileSize * 1.5;

  createAliens();
  resetButton.style.display = "none";
}


