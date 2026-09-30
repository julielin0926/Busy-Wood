const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const timeText = document.getElementById("timeText");
const scoreText = document.getElementById("scoreText");
const messageText = document.getElementById("messageText");
const playerNameInput = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const keys = {};

const game = {
  running: false,
  lastTime: 0,
  timeLeft: 60,
  score: 0,
  carryingWood: false,
};

const player = {
  x: 450,
  y: 280,
  size: 28,
  speed: 240,
};

const cabin = {
  x: 760,
  y: 220,
  width: 96,
  height: 96,
};

const wood = {
  x: 160,
  y: 160,
  size: 26,
  visible: true,
};

function resetGame() {
  game.running = false;
  game.lastTime = 0;
  game.timeLeft = 60;
  game.score = 0;
  game.carryingWood = false;

  player.x = 450;
  player.y = 280;
  spawnWood();
  updateHud();
  draw();
}

function startGame() {
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    messageText.textContent = "請先輸入玩家名稱，再開始遊戲。";
    return;
  }

  resetGame();
  game.running = true;
  startButton.disabled = true;
  restartButton.disabled = false;
  messageText.textContent = `${playerName}，開始搬木頭吧！`;
  requestAnimationFrame(gameLoop);
}

function endGame() {
  game.running = false;
  startButton.disabled = false;
  restartButton.disabled = false;
  messageText.textContent = `遊戲結束！本局分數：${game.score}。`;
}

function gameLoop(timestamp) {
  if (!game.running) return;

  if (!game.lastTime) {
    game.lastTime = timestamp;
  }

  const deltaTime = (timestamp - game.lastTime) / 1000;
  game.lastTime = timestamp;

  update(deltaTime);
  draw();

  if (game.running) {
    requestAnimationFrame(gameLoop);
  }
}

function update(deltaTime) {
  game.timeLeft -= deltaTime;

  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    updateHud();
    endGame();
    draw();
    return;
  }

  movePlayer(deltaTime);
  updateHud();
}

function movePlayer(deltaTime) {
  let moveX = 0;
  let moveY = 0;

  if (keys.ArrowLeft || keys.a) moveX -= 1;
  if (keys.ArrowRight || keys.d) moveX += 1;
  if (keys.ArrowUp || keys.w) moveY -= 1;
  if (keys.ArrowDown || keys.s) moveY += 1;

  if (moveX !== 0 && moveY !== 0) {
    const diagonalFix = Math.sqrt(2);
    moveX /= diagonalFix;
    moveY /= diagonalFix;
  }

  player.x += moveX * player.speed * deltaTime;
  player.y += moveY * player.speed * deltaTime;

  player.x = clamp(player.x, player.size / 2, canvas.width - player.size / 2);
  player.y = clamp(player.y, player.size / 2, canvas.height - player.size / 2);
}

function interact() {
  if (!game.running) return;

  if (!game.carryingWood && wood.visible && distance(player, wood) < 46) {
    game.carryingWood = true;
    wood.visible = false;
    messageText.textContent = "撿到木頭了，快搬回小屋！";
    return;
  }

  if (game.carryingWood && isPlayerInCabin()) {
    game.carryingWood = false;
    game.score += 1;
    spawnWood();
    updateHud();
    messageText.textContent = "成功放下木頭，分數 +1！";
  }
}

function spawnWood() {
  wood.visible = true;
  wood.x = randomBetween(60, 640);
  wood.y = randomBetween(60, 500);
}

function isPlayerInCabin() {
  return (
    player.x > cabin.x &&
    player.x < cabin.x + cabin.width &&
    player.y > cabin.y &&
    player.y < cabin.y + cabin.height
  );
}

function updateHud() {
  timeText.textContent = Math.ceil(game.timeLeft);
  scoreText.textContent = game.score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGround();
  drawCabin();

  if (wood.visible) {
    drawWood(wood.x, wood.y);
  }

  drawPlayer();
}

function drawGround() {
  ctx.fillStyle = "#7fbd67";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  for (let i = 0; i < 18; i += 1) {
    ctx.beginPath();
    ctx.arc(40 + i * 52, 80 + (i % 4) * 110, 22, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCabin() {
  ctx.fillStyle = "#8a5732";
  ctx.fillRect(cabin.x, cabin.y + 30, cabin.width, cabin.height - 30);

  ctx.fillStyle = "#5b2f1f";
  ctx.beginPath();
  ctx.moveTo(cabin.x - 12, cabin.y + 34);
  ctx.lineTo(cabin.x + cabin.width / 2, cabin.y - 18);
  ctx.lineTo(cabin.x + cabin.width + 12, cabin.y + 34);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffe7a3";
  ctx.fillRect(cabin.x + 36, cabin.y + 56, 24, 40);

  ctx.fillStyle = "#24351f";
  ctx.font = "20px Microsoft JhengHei";
  ctx.fillText("小屋", cabin.x + 28, cabin.y + 126);
}

function drawWood(x, y) {
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(x - 18, y - 10, 36, 20);
  ctx.strokeStyle = "#5d371c";
  ctx.lineWidth = 3;
  ctx.strokeRect(x - 18, y - 10, 36, 20);
}

function drawPlayer() {
  ctx.fillStyle = "#2f5fa8";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "18px Microsoft JhengHei";
  ctx.textAlign = "center";
  ctx.fillText("人", player.x, player.y + 7);
  ctx.textAlign = "left";

  if (game.carryingWood) {
    drawWood(player.x, player.y - 28);
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;

  if (event.code === "Space") {
    event.preventDefault();
    interact();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

resetGame();
