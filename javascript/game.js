let canvas, ctx;
let shipImg;
let fireSound, hitSound, deathSound;
// let ship = new Player(1000, 700); //change the position
let ship = new Player(800, 300); 
let bullets = [];
let enemyBullets = [];
let enemies = [];
let keys = {};
let score = 0;
let gameOver = false;
let fireKey = " ";
let enemyColor = "red";
let passes = 0;
let gameSpeed = 1;
let speedupCount = 0;
let lastEnemyShotTime = 0;
let gameTimer;
let gameDuration = 120;
window.gameHistory = [];
let animationId = null; // Track requestAnimationFrame ID


const enemyRows = 4;
const enemyCols = 5;
const spacing = 80;
let enemyDirection = 1;

let winnerImg = new Image();
winnerImg.src = "images/winner.png";

let loserImg = new Image();
loserImg.src = "images/youlost.png";

let champImg = new Image();
champImg.src = "images/champion.png";

let doBetterImg = new Image();
doBetterImg.src = "images/dobetter.png";


//auto-load the Welcome page on site launch

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  shipImg = new Image();
  shipImg.src = "images/ally_jet_1.png";


  bgMusic = document.getElementById("bgMusic")
  fireSound = document.getElementById("cannonSound");
  hitSound = document.getElementById("targetSound");
  deathSound = document.getElementById("blockerSound");

  resizeCanvas();
  showPage('welcome');
  document.getElementById("timeLeft").innerText = 120; // if you start from 120 seconds
  const endButton = document.getElementById("endButton");
  const startButton = document.getElementById("startButton");
  const newGameButton = document.getElementById("newGameButton");
 

  if (endButton) {
    endButton.addEventListener("click", endGame);
  } else {
    alert("End button not found in the DOM.");
  }


  if (newGameButton) {
    newGameButton.addEventListener("click", startNewGame);
  }
});

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => delete keys[e.key]);
window.addEventListener('resize', resizeCanvas);




function startTimer(duration) {
  let timeLeft = duration * 60;
  gameTimer = setInterval(() => {
    timeLeft--;
    const timeLeftSpan = document.getElementById("timeLeft");
    if (timeLeftSpan) {
      timeLeftSpan.innerText = timeLeft;
    }


    if (timeLeft <= 0 || passes >= 3 || enemies.length === 0) {
      endGame();
    }
  }, 1000);

  // Speed up every 5 seconds
  let speedInterval = setInterval(() => {
    if (speedupCount < 4) {
      gameSpeed += 0.5;
      speedupCount++;
    } else {
      clearInterval(speedInterval);
    }
  }, 5000);
}

function stopTimer() {
  clearInterval(gameTimer);
}


function startGame() {
  const fireKey = document.getElementById('fireKey').value;
  const duration = parseInt(document.getElementById('gameDuration').value);
  const goodColor = document.getElementById('goodColor').value;
  const badColor = document.getElementById('badColor').value;

  if (!fireKey) {
    alert("Please set a fire button.");
    return;
  }

  if (duration < 2) {
    alert("Game duration must be at least 2 minutes.");
    return;
  }

  // You can store these settings in global variables or localStorage
  localStorage.setItem("fireKey", fireKey);
  localStorage.setItem("gameDuration", duration);
  localStorage.setItem("goodColor", goodColor);
  localStorage.setItem("badColor", badColor);

  // Proceed to Game
  showPage('game');
  newGame();
}


function newGame() {

  stopTimer();
  stopGameLoop();


  fireKey = localStorage.getItem("fireKey") || " ";
  gameDuration = parseInt(localStorage.getItem("gameDuration")) || 2;
  ship.color = localStorage.getItem("goodColor") || "blue";
  enemyColor = localStorage.getItem("badColor") || "red";

  document.addEventListener("keydown", e => {
    if (e.key === fireKey) shoot();
  });

  // Start background game music
  bgMusic.currentTime = 0;
  bgMusic.play();
  // Start background game music
  resetElements();
  startTimer(gameDuration);
  loop();
}

function resetElements() {
  ship.x = Math.random() * (canvas.width - ship.width);
 // ship.y = canvas.height * 0.91;
  ship.y = canvas.height * 0.84;
  bullets = [];
  enemyBullets = [];
  enemies = [];
  score = 0;
  passes = 0;
  gameOver = false;
  gameSpeed = 1;
  speedupCount = 0;
  document.getElementById("timeLeft").textContent = timeLeft;

  updateLivesDisplay();
  document.getElementById("scoreDisplay").textContent = score;

  for (let r = 0; r < enemyRows; r++) {
    for (let c = 0; c < enemyCols; c++) {
      enemies.push(new Enemy(100 + c * spacing, 50 + r * spacing, r));
    }
  }
}

function shoot() {
  bullets.push(new Bullet(ship.x + ship.width / 2, ship.y, 7));
  fireSound.play();
}

function update() {
  ship.move(keys, canvas);

  bullets.forEach(b => b.move(-1));      // Player bullets go UP
  enemyBullets.forEach(b => b.move(1));  // Enemy bullets go DOWN

  bullets = bullets.filter(b => b.y > 0);
  enemyBullets = enemyBullets.filter(b => b.y < canvas.height);

  // Move enemies together
  let hitEdge = false;
  enemies.forEach(e => {
    e.move(enemyDirection, gameSpeed);
    if (e.x <= 0 || e.x >= canvas.width - 40) hitEdge = true;
  });
  if (hitEdge) {
    enemyDirection *= -1;
    enemies.forEach(e => e.y += 20);
  }

  // Collision detection (player bullets vs enemies)
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x > e.x && b.x < e.x + 40 && b.y > e.y && b.y < e.y + 40) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score += (enemyRows - e.row) * 5;
        hitSound.play();
        document.getElementById("scoreDisplay").textContent = score;

      }
    });
  });

  // Enemy shoots if last shot traveled 3/4 of canvas
  const now = Date.now();
  if (enemyBullets.length === 0 || (enemyBullets[0].y > canvas.height * 0.75 && now - lastEnemyShotTime > 500)) {
    let shooter = enemies[Math.floor(Math.random() * enemies.length)];
    if (shooter) {
      enemyBullets.push(new Bullet(shooter.x + 20, shooter.y + 20, 3 + gameSpeed));
      lastEnemyShotTime = now;
    }
  }

  // Enemy bullet hits player
  enemyBullets.forEach((b, bi) => {
    if (b.x > ship.x && b.x < ship.x + ship.width && b.y > ship.y && b.y < ship.y + ship.height) {
      passes++;
      deathSound.play();
      updateLivesDisplay();
      ship.x = Math.random() * (canvas.width - ship.width);
      ship.y = canvas.height * 0.84;
      enemyBullets.splice(bi, 1);
    }
  });

  if (passes >= 3 || enemies.length === 0) {
    endGame();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw good ship
  ctx.fillStyle = ship.color;
  ship.draw(ctx, shipImg);

  // Draw bullets
  bullets.forEach(b => b.draw(ctx, "magenta"));


  // Draw enemy bullets
  enemyBullets.forEach(b => b.draw(ctx, "black"));
  // Draw enemies
  enemies.forEach(e => e.draw(ctx, enemyColor));



  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";


  if (gameOver) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    let imgToShow;

    if (passes >= 3) {
      // Player lost by 3 hits
      imgToShow = loserImg;
    } else if (score >= 249) {
      // Player killed all enemies (perfect score)
      imgToShow = champImg;
    }
      else if (score >= 100) {
      // Player survived with decent score
      imgToShow = winnerImg;
    }
    else {
      // Player survived but weak score
      imgToShow = doBetterImg;
    }

    const desiredWidth = 500;  // or whatever size fits nicely
    const desiredHeight = 500; // adjust height proportionally

    ctx.drawImage(
        imgToShow,
        canvas.width / 2 - desiredWidth / 2,
        canvas.height / 2 - desiredHeight / 2,
        desiredWidth,
        desiredHeight
    );
  }
}

function loop() {
  update();
  draw();

  if (!gameOver) {
    animationId = requestAnimationFrame(loop);
  }
}

function stopGameLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}




function endGame() {
  if (!gameOver) {
    gameOver = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stopTimer();
    stopGameLoop();
       // Safely stop background music
    if (!bgMusic.paused) {
    bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    // Save the score
    gameHistory.push({ gameNumber: gameHistory.length + 1, score });
    updateGameHistory();
  }

  

}

//New game Function, Previous Game is not saved in history
function startNewGame() {
  stopTimer();
  stopGameLoop();

  // Stop music just in case
  if (!bgMusic.paused) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }

  gameOver = false;

  // Skip pushing to gameHistory

  // Restart a new game
  showPage('game');
  newGame();
}



