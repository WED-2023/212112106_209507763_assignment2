// Combined Game Logic File

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const shipImg = new Image();
shipImg.src = "images/spaceship.jpg";

const fireSound = document.getElementById("cannonSound");
const hitSound = document.getElementById("targetSound");
const deathSound = document.getElementById("blockerSound");

let ship = { x: 0, y: 0, width: 40, height: 60, speed: 5, color: "blue" };
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

const enemyRows = 4;
const enemyCols = 5;
const spacing = 80;
let enemyDirection = 1;
   //auto-load the Welcome page on site launch

window.onload = () => {
    showPage('welcome');
  document.getElementById("startButton").addEventListener("click", newGame);
};

// document.addEventListener("keydown", e => keys[e.key] = true);
// document.addEventListener("keyup", e => delete keys[e.key]);


// document.addEventListener("keydown", e => {
//     if (e.key === fireKey && !fireInterval && !gameOver) {
//       shoot(); // instant fire
//       fireInterval = setInterval(shoot, 300); // auto fire
//     }
//   });
  
//   document.addEventListener("keyup", e => {
//     delete keys[e.key];
//     if (e.key === fireKey) {
//       clearInterval(fireInterval);
//       fireInterval = null;
//     }
//   });

  document.addEventListener("keydown", e => {
    keys[e.key] = true;
  
    if (e.key === fireKey && !gameOver) {
      shoot();
    }
  });
  
  document.addEventListener("keyup", e => {
    delete keys[e.key];
  });

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('load', () => {
    resizeCanvas();
    document.getElementById("startButton").addEventListener("click", newGame);
  });

  

function startTimer(duration) {
  let timeLeft = duration * 60;
  gameTimer = setInterval(() => {
    timeLeft--;
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
    }
// function newGame() {
//   fireKey = localStorage.getItem("fireKey") || " ";
//   gameDuration = parseInt(localStorage.getItem("gameDuration")) || 2;
//   ship.color = localStorage.getItem("goodColor") || "blue";
//   enemyColor = localStorage.getItem("badColor") || "red";

//   document.addEventListener("keydown", e => {
//     if (e.key === fireKey) shoot();
//   });

//   resetElements();
//   startTimer(gameDuration);
//   loop();
// }


function newGame() {
    fireKey = localStorage.getItem("fireKey") || " ";
    gameDuration = parseInt(localStorage.getItem("gameDuration")) || 2;
    ship.color = localStorage.getItem("goodColor") || "blue";
    enemyColor = localStorage.getItem("badColor") || "red";
  
    resetElements();
    startTimer(gameDuration);
    loop();
  }

function resetElements() {
  ship.x = Math.random() * (canvas.width - ship.width);
  ship.y = canvas.height * 0.65;
  bullets = [];
  enemyBullets = [];
  enemies = [];
  score = 0;
  passes = 0;
  gameOver = false;
  gameSpeed = 1;
  speedupCount = 0;

  for (let r = 0; r < enemyRows; r++) {
    for (let c = 0; c < enemyCols; c++) {
      enemies.push({ x: 100 + c * spacing, y: 50 + r * spacing, row: r });
    }
  }
}

function shoot() {
  bullets.push({ x: ship.x + ship.width / 2, y: ship.y, speed: 7 });
  fireSound.play();
}

function update() {
  if (keys["ArrowLeft"] && ship.x > 0) ship.x -= ship.speed;
  if (keys["ArrowRight"] && ship.x < canvas.width - ship.width) ship.x += ship.speed;
  if (keys["ArrowUp"] && ship.y > canvas.height * 0.6) ship.y -= ship.speed;
  if (keys["ArrowDown"] && ship.y < canvas.height - ship.height) ship.y += ship.speed;

  bullets.forEach(b => b.y -= b.speed);
  enemyBullets.forEach(b => b.y += b.speed);

  bullets = bullets.filter(b => b.y > 0);
  enemyBullets = enemyBullets.filter(b => b.y < canvas.height);

  // Move enemies together
  let hitEdge = false;
  enemies.forEach(e => {
    e.x += enemyDirection * gameSpeed;
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
        score += (e.row + 1) * 5;
        hitSound.play();
      }
    });
  });

  // Enemy shoots if last shot traveled 3/4 of canvas
  const now = Date.now();
  if (enemyBullets.length === 0 || (enemyBullets[0].y > canvas.height * 0.75 && now - lastEnemyShotTime > 500)) {
    let shooter = enemies[Math.floor(Math.random() * enemies.length)];
    if (shooter) {
      enemyBullets.push({ x: shooter.x + 20, y: shooter.y + 20, speed: 3 + gameSpeed });
      lastEnemyShotTime = now;
    }
  }

  // Enemy bullet hits player
  enemyBullets.forEach((b, bi) => {
    if (b.x > ship.x && b.x < ship.x + ship.width && b.y > ship.y && b.y < ship.y + ship.height) {
      passes++;
      deathSound.play();
      ship.x = Math.random() * (canvas.width - ship.width);
      ship.y = canvas.height * 0.65;
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
  ctx.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  // Draw bullets
  ctx.fillStyle = "magenta";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Draw enemy bullets
  ctx.fillStyle = "black";
  enemyBullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Draw enemies
  ctx.fillStyle = enemyColor;
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.rect(e.x, e.y, 40, 40);
    ctx.fill();
  });

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Lives: " + (3 - passes), 10, 45);

  if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  }
}

function loop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(loop);
  }
}

function endGame() {
  gameOver = true;
  stopTimer();
  setTimeout(() => alert("Game Over! Final Score: " + score), 500);
}
