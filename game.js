const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const timeText = document.getElementById("timeText");
const scoreText = document.getElementById("scoreText");
const messageText = document.getElementById("messageText");
const playerNameInput = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const rankingList = document.getElementById("rankingList");

const keys = {};
const rankingStorageKey = "forestCarryRanking";

const assets = {
  background: loadImage("assets/forest-background.png"),
  otter: loadImage("assets/otter.png"),
  fox: loadImage("assets/fox.png"),
  wood: loadImage("assets/wood.png"),
};

const game = {
  running: false,
  lastTime: 0,
  timeLeft: 60,
  score: 0,
  carryingWood: false,
};

const player = {
  x: 450,
  y: 300,
  size: 58,
  speed: 240,
};

const cabin = {
  x: 746,
  y: 190,
  width: 118,
  height: 150,
};

const wood = {
  x: 160,
  y: 160,
  size: 26,
  visible: true,
};

const fox = {
  x: 675,
  y: 432,
  size: 42,
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
  const playerName = playerNameInput.value.trim();

  game.running = false;
  startButton.disabled = false;
  restartButton.disabled = false;
  saveScore(playerName, game.score);
  renderRanking();
  messageText.textContent = `遊戲結束！${playerName} 本局分數：${game.score}。`;
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

function loadRanking() {
  const savedRanking = localStorage.getItem(rankingStorageKey);

  if (!savedRanking) {
    return [];
  }

  try {
    return JSON.parse(savedRanking);
  } catch {
    return [];
  }
}

function saveScore(playerName, score) {
  const ranking = loadRanking();
  const oldRecord = ranking.find((record) => record.name === playerName);

  if (oldRecord) {
    oldRecord.score = Math.max(oldRecord.score, score);
  } else {
    ranking.push({
      name: playerName,
      score,
    });
  }

  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem(rankingStorageKey, JSON.stringify(ranking.slice(0, 10)));
}

function renderRanking() {
  const ranking = loadRanking();
  rankingList.innerHTML = "";

  if (ranking.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "目前還沒有紀錄。";
    rankingList.appendChild(emptyItem);
    return;
  }

  ranking.forEach((record) => {
    const item = document.createElement("li");
    item.textContent = `${record.name}：${record.score} 分`;
    rankingList.appendChild(item);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (assets.background.complete) {
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);
  } else {
    drawGround();
  }

  if (wood.visible) {
    drawWood(wood.x, wood.y);
  }

  drawFox(fox.x, fox.y);
  drawPlayer();
}

function drawGround() {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, "#f8efd2");
  skyGradient.addColorStop(0.55, "#ead7a8");
  skyGradient.addColorStop(1, "#9f8d54");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCloud(42, 92, 1.1);
  drawCloud(705, 95, 0.8);

  ctx.fillStyle = "rgba(218, 171, 96, 0.55)";
  ctx.beginPath();
  ctx.arc(128, 78, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8a8149";
  ctx.beginPath();
  ctx.moveTo(0, 410);
  ctx.bezierCurveTo(140, 365, 255, 432, 410, 388);
  ctx.bezierCurveTo(560, 345, 690, 390, 900, 350);
  ctx.lineTo(900, 560);
  ctx.lineTo(0, 560);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 244, 205, 0.5)";
  ctx.beginPath();
  ctx.moveTo(470, 560);
  ctx.bezierCurveTo(540, 500, 608, 468, 750, 360);
  ctx.bezierCurveTo(725, 410, 650, 475, 540, 560);
  ctx.closePath();
  ctx.fill();
}

function drawForest() {
  for (let i = 0; i < 9; i += 1) {
    drawPineTree(44 + i * 86, 318 + (i % 3) * 12, 0.82 + (i % 2) * 0.18);
  }

  drawTallTree(835, 246, 1.1);
  drawTallTree(875, 230, 1.25);
}

function drawCloud(x, y, scale) {
  ctx.fillStyle = "rgba(255, 249, 230, 0.55)";
  ctx.strokeStyle = "rgba(170, 138, 91, 0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 18 * scale, 34 * scale, Math.PI, Math.PI * 2);
  ctx.arc(x + 40 * scale, y, 42 * scale, Math.PI, Math.PI * 2);
  ctx.arc(x + 88 * scale, y + 20 * scale, 36 * scale, Math.PI, Math.PI * 2);
  ctx.lineTo(x + 120 * scale, y + 42 * scale);
  ctx.lineTo(x - 36 * scale, y + 42 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawPineTree(x, y, scale) {
  ctx.strokeStyle = "#5b4728";
  ctx.lineWidth = 3;
  ctx.fillStyle = "#84753e";
  ctx.fillRect(x - 5 * scale, y - 8 * scale, 10 * scale, 62 * scale);

  for (let layer = 0; layer < 5; layer += 1) {
    const top = y - 112 * scale + layer * 28 * scale;
    const width = (34 + layer * 13) * scale;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x - width, top + 48 * scale);
    ctx.quadraticCurveTo(x, top + 36 * scale, x + width, top + 48 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function drawTallTree(x, y, scale) {
  ctx.strokeStyle = "#3d241b";
  ctx.lineCap = "round";
  ctx.lineWidth = 13 * scale;
  ctx.beginPath();
  ctx.moveTo(x, y + 260 * scale);
  ctx.lineTo(x + 10 * scale, y);
  ctx.stroke();

  ctx.lineWidth = 7 * scale;
  [[-6, 105, -54, 42], [8, 130, 46, 72], [2, 70, 52, 10], [12, 180, 62, 132]].forEach(([sx, sy, ex, ey]) => {
    ctx.beginPath();
    ctx.moveTo(x + sx * scale, y + sy * scale);
    ctx.lineTo(x + ex * scale, y + ey * scale);
    ctx.stroke();
  });
}

function drawCabin() {
  const x = cabin.x - 28;
  const y = cabin.y - 10;
  const width = cabin.width + 46;
  const height = cabin.height + 22;

  ctx.fillStyle = "#bb6f32";
  ctx.strokeStyle = "#5c2c1b";
  ctx.lineWidth = 3;
  ctx.fillRect(x + 10, y + 64, width - 20, height - 48);
  ctx.strokeRect(x + 10, y + 64, width - 20, height - 48);

  ctx.strokeStyle = "rgba(92, 44, 27, 0.32)";
  ctx.lineWidth = 2;
  for (let lineY = y + 78; lineY < y + height + 4; lineY += 16) {
    ctx.beginPath();
    ctx.moveTo(x + 16, lineY);
    ctx.lineTo(x + width - 18, lineY + Math.sin(lineY) * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "#6b2e1f";
  ctx.strokeStyle = "#3d2018";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 2, y + 70);
  ctx.lineTo(x + width / 2, y + 12);
  ctx.lineTo(x + width + 2, y + 70);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(39, 19, 13, 0.35)";
  ctx.lineWidth = 2;
  for (let tileX = x + 18; tileX < x + width - 12; tileX += 22) {
    ctx.beginPath();
    ctx.arc(tileX, y + 66, 13, Math.PI, 0);
    ctx.stroke();
  }

  drawWindow(x + 30, y + 92);
  drawWindow(x + width - 58, y + 92);

  ctx.fillStyle = "#f3dfbb";
  ctx.strokeStyle = "#5c2c1b";
  ctx.lineWidth = 3;
  ctx.fillRect(x + width / 2 - 13, y + 100, 26, 42);
  ctx.strokeRect(x + width / 2 - 13, y + 100, 26, 42);

  ctx.fillStyle = "#3d2c1d";
  ctx.font = "20px Microsoft JhengHei";
  ctx.fillText("小屋", x + 50, y + 168);
}

function drawWindow(x, y) {
  ctx.fillStyle = "#ffe7a3";
  ctx.strokeStyle = "#5c2c1b";
  ctx.lineWidth = 3;
  ctx.fillRect(x, y, 26, 28);
  ctx.strokeRect(x, y, 26, 28);
  ctx.beginPath();
  ctx.moveTo(x + 13, y);
  ctx.lineTo(x + 13, y + 28);
  ctx.moveTo(x, y + 14);
  ctx.lineTo(x + 26, y + 14);
  ctx.stroke();
}

function drawWood(x, y) {
  if (assets.wood.complete) {
    drawImageCentered(assets.wood, x, y, 48, 30);
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.12);
  ctx.fillStyle = "#9b6530";
  ctx.strokeStyle = "#5d371c";
  ctx.lineWidth = 3;
  roundRect(-23, -10, 46, 20, 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawFox(x, y) {
  if (assets.fox.complete) {
    drawImageCentered(assets.fox, x, y, 72, 40);
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#d6792f";
  ctx.beginPath();
  ctx.ellipse(0, 8, 36, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawPlayer() {
  if (assets.otter.complete) {
    drawImageCentered(assets.otter, player.x, player.y - 18, 44, 76);
  } else {
    ctx.fillStyle = "#2f5fa8";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  if (game.carryingWood) {
    drawWood(player.x, player.y - 58);
  }
}

function drawImageCentered(image, centerX, centerY, width, height) {
  ctx.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
}

function loadImage(src) {
  const image = new Image();
  image.src = src;
  image.onload = draw;
  return image;
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
renderRanking();
