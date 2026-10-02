const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const timeText = document.getElementById("timeText");
const scoreText = document.getElementById("scoreText");
const messageText = document.getElementById("messageText");
const playerNameInput = document.getElementById("playerName");
const startScreen = document.getElementById("startScreen");
const nameScreen = document.getElementById("nameScreen");
const gameShell = document.getElementById("gameShell");
const showNameButton = document.getElementById("showNameButton");
const confirmNameButton = document.getElementById("confirmNameButton");
const nameHint = document.getElementById("nameHint");
const restartButton = document.getElementById("restartButton");
const rankingList = document.getElementById("rankingList");

const keys = {};
const rankingStorageKey = "forestCarryRanking";

const assets = {
  background: loadImage("assets/forest-background.png"),
  otter: loadImage("assets/otter.png"),
  fox: loadImage("assets/fox.png"),
  wood: loadImage("assets/wood.png"),
  tornado: loadImage("data:image/png;base64,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"),
};

const game = {
  running: false,
  lastTime: 0,
  timeLeft: 60,
  score: 0,
  carryingWood: false,
  stunTime: 0,
  invincibleTime: 0,
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
  startX: 675,
  startY: 432,
  size: 42,
  speed: 95,
  stealRange: 38,
  stolenCooldown: 0,
};

const tornadoes = [
  {
    x: 260,
    y: 380,
    startX: 260,
    startY: 380,
    radius: 34,
    speed: 105,
    chaseSpeed: 140,
    direction: 1,
    minX: 130,
    maxX: 585,
    minY: 260,
    maxY: 480,
    chaseRange: 100,
    spin: 0,
  },
];

function resetGame() {
  game.running = false;
  game.lastTime = 0;
  game.timeLeft = 60;
  game.score = 0;
  game.carryingWood = false;
  game.stunTime = 0;
  game.invincibleTime = 0;

  tornadoes[0].x = tornadoes[0].startX;
  tornadoes[0].y = tornadoes[0].startY;
  tornadoes[0].direction = 1;
  tornadoes[0].spin = 0;

  player.x = 450;
  player.y = 280;

  fox.x = fox.startX;
  fox.y = fox.startY;
  fox.stolenCooldown = 0;

  spawnWood();
  updateHud();
  draw();
}

function startGame() {
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    nameHint.textContent = "請先輸入玩家名稱。";
    return;
  }

  startScreen.classList.add("hidden");
  nameScreen.classList.add("hidden");
  gameShell.classList.remove("hidden");

  resetGame();
  game.running = true;
  restartButton.disabled = false;
  messageText.textContent = `${playerName}，開始搬木頭吧！`;
  requestAnimationFrame(gameLoop);
}

function endGame() {
  const playerName = playerNameInput.value.trim();

  game.running = false;
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

  updateTornadoes(deltaTime);
  updateFox(deltaTime);

  if (game.invincibleTime > 0) {
  game.invincibleTime = Math.max(0, game.invincibleTime - deltaTime);
  }

  if (game.stunTime > 0) {
    game.stunTime = Math.max(0, game.stunTime - deltaTime);
  } else {
    movePlayer(deltaTime);
  }

  checkTornadoCollision();
  updateHud();
}

function updateTornadoes(deltaTime) {
  tornadoes.forEach((tornado) => {
    tornado.spin += deltaTime * 8;

    const playerDistance = distance(player, tornado);

    if (playerDistance < tornado.chaseRange) {
      const dx = player.x - tornado.x;
      const dy = player.y - tornado.y;
      const length = Math.hypot(dx, dy);

      if (length > 0) {
        tornado.x += (dx / length) * tornado.chaseSpeed * deltaTime;
        tornado.y += (dy / length) * tornado.chaseSpeed * deltaTime;
      }
    } else {
      tornado.x += tornado.speed * tornado.direction * deltaTime;

      if (tornado.x > tornado.maxX) {
        tornado.x = tornado.maxX;
        tornado.direction = -1;
      }

      if (tornado.x < tornado.minX) {
        tornado.x = tornado.minX;
        tornado.direction = 1;
      }

      if (tornado.y < tornado.startY) {
        tornado.y += tornado.speed * deltaTime;
      }

      if (tornado.y > tornado.startY) {
        tornado.y -= tornado.speed * deltaTime;
      }
    }

    tornado.x = clamp(tornado.x, tornado.minX, tornado.maxX);
    tornado.y = clamp(tornado.y, tornado.minY, tornado.maxY);
  });
}

function updateFox(deltaTime) {
  if (fox.stolenCooldown > 0) {
    fox.stolenCooldown = Math.max(0, fox.stolenCooldown - deltaTime);

    if (fox.stolenCooldown === 0) {
      spawnWood();
      messageText.textContent = "狐狸把木頭丟到別的地方了！";
    }

    return;
  }

  if (!wood.visible || game.carryingWood) {
    moveFoxBack(deltaTime);
    return;
  }

  const dx = wood.x - fox.x;
  const dy = wood.y - fox.y;
  const length = Math.hypot(dx, dy);

  if (length > 0) {
    fox.x += (dx / length) * fox.speed * deltaTime;
    fox.y += (dy / length) * fox.speed * deltaTime;
  }

  if (distance(fox, wood) < fox.stealRange) {
    wood.visible = false;
    fox.stolenCooldown = 2.0;
    messageText.textContent = "狐狸偷走木頭了！";
  }
}

function moveFoxBack(deltaTime) {
  const dx = fox.startX - fox.x;
  const dy = fox.startY - fox.y;
  const length = Math.hypot(dx, dy);

  if (length < 2) {
    fox.x = fox.startX;
    fox.y = fox.startY;
    return;
  }

  fox.x += (dx / length) * fox.speed * deltaTime;
  fox.y += (dy / length) * fox.speed * deltaTime;
}

function checkTornadoCollision() {
  if (game.stunTime > 0 || game.invincibleTime > 0) return;

  const hit = tornadoes.some((tornado) => distance(player, tornado) < tornado.radius + player.size * 0.28);

  if (!hit) return;

  game.stunTime = 1.1;
  game.invincibleTime = 2.5;

  if (game.carryingWood) {
    game.carryingWood = false;
    wood.visible = true;
    wood.x = clamp(player.x - 42, 60, 640);
    wood.y = clamp(player.y + 24, 60, 500);
    messageText.textContent = "被龍捲風吹到，木頭掉了！";
  } else {
    messageText.textContent = "被龍捲風吹到，暫時不能動！";
  }
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

  tornadoes.forEach(drawTornado);
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

function drawTornado(tornado) {
  if (assets.tornado.complete) {
    ctx.save();
    ctx.translate(tornado.x, tornado.y);
    ctx.rotate(Math.sin(tornado.spin) * 0.08);
    ctx.globalAlpha = 0.9;
    ctx.drawImage(assets.tornado, -35, -46, 70, 92);
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(tornado.x, tornado.y);
  ctx.rotate(tornado.spin);

  const gradient = ctx.createRadialGradient(0, 0, 8, 0, 0, tornado.radius);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.92)");
  gradient.addColorStop(0.48, "rgba(196, 185, 160, 0.68)");
  gradient.addColorStop(1, "rgba(126, 111, 91, 0.1)");
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.ellipse(0, -8, 24, 12, 0.2, 0, Math.PI * 2);
  ctx.ellipse(0, 5, 30, 15, -0.3, 0, Math.PI * 2);
  ctx.ellipse(0, 19, 20, 10, 0.3, 0, Math.PI * 2);
  ctx.fill();

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
  if (game.stunTime > 0 || game.invincibleTime > 0) {
  ctx.save();
  ctx.globalAlpha = 0.45 + Math.sin(Date.now() / 90) * 0.25;
  }

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

  if (game.stunTime > 0 || game.invincibleTime > 0) {
  ctx.restore();
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

showNameButton.addEventListener("click", function () {
  startScreen.classList.add("hidden");
  nameScreen.classList.remove("hidden");
  playerNameInput.focus();
});

confirmNameButton.addEventListener("click", startGame);

playerNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    startGame();
  }
});

restartButton.addEventListener("click", startGame);

resetGame();
renderRanking();