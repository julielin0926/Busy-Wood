const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const timeText = document.getElementById("timeText");
const scoreText = document.getElementById("scoreText");
const messageText = document.getElementById("messageText");
const playerNameInput = document.getElementById("playerName");
const startScreen = document.getElementById("startScreen");
const nameScreen = document.getElementById("nameScreen");
const tutorialScreen = document.getElementById("tutorialScreen");
const gameShell = document.getElementById("gameShell");
const showNameButton = document.getElementById("showNameButton");
const exitGameButton = document.getElementById("exitGameButton");
const confirmNameButton = document.getElementById("confirmNameButton");
const tutorialContinueButton = document.getElementById("tutorialContinueButton");
const nameHint = document.getElementById("nameHint");
const restartButton = document.getElementById("restartButton");
const rankingList = document.getElementById("rankingList");
const gameAlert = document.getElementById("gameAlert");
const gameAlertText = document.getElementById("gameAlertText");
const closeAlertButton = document.getElementById("closeAlertButton");
const bgm = document.getElementById("bgm");
const joystickBase = document.getElementById("joystickBase");
const joystickKnob = document.getElementById("joystickKnob");
const throwButton = document.getElementById("throwButton");
const mobileResultScreen = document.getElementById("mobileResultScreen");
const finalScoreText = document.getElementById("finalScoreText");
const mobileRankingList = document.getElementById("mobileRankingList");
const mobileRestartButton = document.getElementById("mobileRestartButton");
const mobileHomeButton = document.getElementById("mobileHomeButton");
const mobileCloseGameButton = document.getElementById("mobileCloseGameButton");
const announcementModal = document.getElementById("announcementModal");
const closeAnnouncementButton = document.getElementById("closeAnnouncementButton");

const keys = {};

const mobileMove = {
  active: false,
  touchId: null,
  targetX: 0,
  targetY: 0,
  startCanvasX: 0,
  startCanvasY: 0,
  moved: false,
};

const mobileThrow = {
  active: false,
  touchId: null,
  power: 0,
  minPower: 18,
};

const mobileTap = {
  active: false,
  touchId: null,
  x: 0,
  y: 0,
};

const rankingStorageKey = "forestCarryRanking";

const assets = {
  background: loadImage("assets/forest-background.png"),
  otter: loadImage("assets/otter.png"),
  fox: loadImage("assets/fox.png"),
  foxAlert: loadImage("assets/fox-alert.png"),
  bagEmpty: loadImage("assets/otter-bag-preview-v2.png"),
  bagFull: loadImage("assets/otter-bag-full-preview-v2.png"),
  wood: loadImage("assets/wood.png"),
  rock: loadImage("assets/rock.png"),
  foxDen: loadImage("assets/fox-den.png"),
  tornado: loadImage("assets/tornado.png"),
};

const game = {
  running: false,
  lastTime: 0,
  timeLeft: 60,
  score: 0,
  carryingWood: false,
  carryingWoodIndex: null,
  carryingWoodCount: 0,
  carryingWoodIndexes: [],
  deliveredWoodCount: 0,
  hasBag: false,
  bagAlertShown: false,
  carryingRock: false,
  stunTime: 0,
  invincibleTime: 0,
  foxDenWarningCooldown: 0,
  tensionMode: false,
};

const player = {
  x: 450,
  y: 300,
  size: 58,
  speed: 240,
};

const spawnArea = {
  minX: 110,
  maxX: 980,
  minY: 120,
  maxY: 610,
};

const cabin = {
  x: 1010,
  y: 130,
  width: 220,
  height: 260,
};

const cabinSafeZone = {
  radius: 170,
};

const woods = [
  { x: 160, y: 160, size: 26, visible: true },
  { x: 360, y: 420, size: 26, visible: true },
  { x: 560, y: 180, size: 26, visible: true },
];

const rock = {
  x: 320,
  y: 330,
  size: 24,
  visible: true,
  carried: false,
  respawnTimer: 0,
};

const thrownRock = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  size: 18,
  active: false,
  startX: 0,
  startY: 0,
  maxDistance: 260,
};

const reflectedRock = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  size: 18,
  active: false,
};
const aim = {
  active: false,
  mouseX: 0,
  mouseY: 0,
  maxRange: 220,
};

const fox = {
  x: 82,
  y: 600,
  startX: 82,
  startY: 600,
  size: 42,
  speed: 80,
  stealRange: 55,
  fearRange: 150,
  stealCooldown: 0,
  stealCooldownDuration: 5,
  state: "idle",
  carryingWood: false,
  stolenWoodIndex: null,
  hurtTime: 0,
};

const foxDen = {
  x: 82,
  y: 570,
  radius: 58,
};

const tornadoes = [
  {
    x: 260,
    y: 380,
    startX: 260,
    startY: 380,
    radius: 34,
    speed: 105,
    chaseSpeed: 150,
    direction: 1,
    minX: 60,
    maxX: 840,
    minY: 60,
    maxY: 500,

    mode: "patrol",
    targetWoodIndex: 0,
    patrolTimer: 0,
    patrolDuration: 4,

    chaseRange: 170,
    chaseTimer: 0,
    chaseDuration: 1.5,
    chaseCooldown: 0,
    chaseCooldownDuration: 2.0,

    spin: 0,
  },
];

function resetGame() {
  game.running = false;
  game.lastTime = 0;
  game.timeLeft = 60;
  game.score = 0;
  game.carryingWood = false;
  game.carryingWoodIndex = null;
  game.carryingWoodCount = 0;
  game.carryingWoodIndexes = [];
  game.deliveredWoodCount = 0;
  game.hasBag = false;
  game.bagAlertShown = false;
  game.carryingRock = false;
  game.stunTime = 0;
  game.invincibleTime = 0;
  game.foxDenWarningCooldown = 0;
  game.tensionMode = false;
  thrownRock.active = false;
  reflectedRock.active = false;
  stopMobileMove();
  mobileThrow.active = false;
  mobileThrow.touchId = null;
  mobileThrow.power = 0;
  mobileTap.active = false;
  mobileTap.touchId = null;
  aim.active = false;
  updateThrowButtonState();

  tornadoes[0].x = tornadoes[0].startX;
  tornadoes[0].y = tornadoes[0].startY;
  tornadoes[0].direction = 1;
  tornadoes[0].mode = "patrol";
  tornadoes[0].chaseTimer = 0;
  tornadoes[0].chaseCooldown = 0;
  tornadoes[0].targetWoodIndex = 0;
  tornadoes[0].patrolTimer = 0;
  tornadoes[0].spin = 0;

  player.x = 450;
  player.y = 280;

  fox.x = fox.startX;
  fox.y = fox.startY;
  fox.stealCooldown = 0;
  fox.state = "idle";
  fox.carryingWood = false;
  fox.stolenWoodIndex = null;
  fox.hurtTime = 0;

  rock.visible = true;
  rock.carried = false;
  rock.respawnTimer = 0;
  rock.x = randomBetween(spawnArea.minX, spawnArea.maxX);
  rock.y = randomBetween(spawnArea.minY, spawnArea.maxY);

  spawnAllWoods();
  updateHud();
  draw();
}

function playBackgroundMusic() {
  if (!bgm) return;

  bgm.volume = 0.35;

  if (bgm.paused) {
    bgm.play().catch(() => {
      messageText.textContent = "點一下畫面後，背景音樂就會開始播放。";
    });
  }
}
function showGameAlert(text) {
  gameAlertText.textContent = text;
  gameAlert.classList.remove("hidden");
}


function goHome() {
  game.running = false;
  game.lastTime = 0;
  stopMobileMove();
  mobileThrow.active = false;
  mobileThrow.touchId = null;
  mobileThrow.power = 0;
  mobileTap.active = false;
  mobileTap.touchId = null;
  aim.active = false;
  updateThrowButtonState();
  document.body.classList.remove("mobile-playing");

  gameShell.classList.add("hidden");
  tutorialScreen.classList.add("hidden");
  nameScreen.classList.add("hidden");
  if (mobileResultScreen) {
    mobileResultScreen.classList.add("hidden");
  }
  startScreen.classList.remove("hidden");
  nameHint.textContent = "";
  messageText.textContent = "點木頭搬回小屋，別讓狐狸偷走！";

  resetGame();
  if (rankingList) {
    renderRanking();
  }
}

function exitGame() {
  goHome();
  window.close();
}

function startGame() {
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    nameHint.textContent = "請先輸入玩家名稱。";
    return;
  }

  startScreen.classList.add("hidden");
  nameScreen.classList.add("hidden");

  if (mobileResultScreen) {
    mobileResultScreen.classList.add("hidden");
  }

  gameShell.classList.remove("hidden");

  resetGame();
  game.running = true;
  document.body.classList.add("mobile-playing");
  playBackgroundMusic();
  if (restartButton) {
  restartButton.disabled = false;
  }
  messageText.textContent = `${playerName}，開始搬木頭吧！`;
  requestAnimationFrame(gameLoop);
}

function endGame() {
  const playerName = playerNameInput.value.trim();

  game.running = false;
  stopMobileMove();
  mobileThrow.active = false;
  mobileThrow.touchId = null;
  mobileThrow.power = 0;
  mobileTap.active = false;
  mobileTap.touchId = null;
  aim.active = false;
  updateThrowButtonState();
  document.body.classList.remove("mobile-playing");
  gameShell.classList.add("hidden");

  if (restartButton) {
    restartButton.disabled = false;
  }

  saveScore(playerName, game.score);

  if (rankingList) {
    renderRanking();
  }

  showMobileResult(playerName, game.score);
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

  updateTensionMode();
  updateTornadoes(deltaTime);
  updateFoxHurt(deltaTime);
  updateFox(deltaTime);
  updateThrownRock(deltaTime);
  updateReflectedRock(deltaTime);
  updateRockRespawn(deltaTime);
  updateFoxDenWarning(deltaTime);


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

function updateTensionMode() {
  if (game.tensionMode || game.timeLeft > 30) return;

  game.tensionMode = true;
  messageText.textContent = "剩下 30 秒！狐狸和龍捲風變得更急了！";
}

function getFoxSpeedMultiplier() {
  return game.tensionMode ? 1.25 : 1;
}

function getTornadoSpeedMultiplier() {
  return game.tensionMode ? 1.18 : 1;
}
function updateRockRespawn(deltaTime) {
  if (rock.respawnTimer <= 0) return;

  rock.respawnTimer = Math.max(0, rock.respawnTimer - deltaTime);

  if (rock.respawnTimer === 0) {
    rock.visible = true;
    rock.x = randomBetween(spawnArea.minX, spawnArea.maxX);
    rock.y = randomBetween(spawnArea.minY, spawnArea.maxY);
    messageText.textContent = "新的石頭出現了！";
  }
}

function updateThrownRock(deltaTime) {
  if (!thrownRock.active) return;

  thrownRock.x += thrownRock.vx * deltaTime;
  thrownRock.y += thrownRock.vy * deltaTime;

  if (distance(thrownRock, { x: thrownRock.startX, y: thrownRock.startY }) > thrownRock.maxDistance) {
  thrownRock.active = false;
  startRockRespawn();
  messageText.textContent = "石頭沒有打中，新的石頭等等會出現。";
  return;
}

  const hitTornado = tornadoes.find((tornado) => {
    return distance(thrownRock, tornado) < tornado.radius + thrownRock.size;
  });

  if (hitTornado) {
    reflectRockFromTornado(hitTornado);
    return;
  }

  if (isFoxInDen() && distance(thrownRock, fox) < fox.size) {
    thrownRock.active = false;
    startRockRespawn();
    showGameAlert("不能侵門踏戶，打給動保喔!!!!");
    return;
  }

  if (distance(thrownRock, fox) < fox.size) {
    thrownRock.active = false;
    hitFoxWithRock();
    startRockRespawn();
    return;
  }
}

function reflectRockFromTornado(tornado) {
  const dx = player.x - tornado.x;
  const dy = player.y - tornado.y;
  const length = Math.hypot(dx, dy) || 1;
  const speed = 560;

  reflectedRock.x = tornado.x;
  reflectedRock.y = tornado.y;
  reflectedRock.vx = (dx / length) * speed;
  reflectedRock.vy = (dy / length) * speed;
  reflectedRock.active = true;

  thrownRock.active = false;
  startRockRespawn();

  messageText.textContent = "石頭打到龍捲風，被甩回來了！";
}

function updateReflectedRock(deltaTime) {
  if (!reflectedRock.active) return;

  reflectedRock.x += reflectedRock.vx * deltaTime;
  reflectedRock.y += reflectedRock.vy * deltaTime;

  if (
    reflectedRock.x < -40 ||
    reflectedRock.x > canvas.width + 40 ||
    reflectedRock.y < -40 ||
    reflectedRock.y > canvas.height + 40
  ) {
    reflectedRock.active = false;
    return;
  }

  if (distance(reflectedRock, player) < player.size * 0.35 + reflectedRock.size) {
    reflectedRock.active = false;
    game.stunTime = 1.8;
    game.invincibleTime = 2.5;

    if (game.carryingWood) {
      const carriedWood = woods[game.carryingWoodIndex];

      game.carryingWood = false;
      game.carryingWoodIndex = null;

      if (carriedWood) {
        carriedWood.visible = true;
        carriedWood.x = clamp(player.x - 42, spawnArea.minX, spawnArea.maxX);
        carriedWood.y = clamp(player.y + 24, spawnArea.minY, spawnArea.maxY);
      }
    }

    messageText.textContent = "被甩回來的石頭砸到，暫時不能動！";
  }
}
function hitFoxWithRock() {
  fox.hurtTime = 5;

  if (fox.carryingWood) {
    dropStolenWood();
    fox.carryingWood = false;
    fox.stolenWoodIndex = null;
    fox.state = "scared";
    messageText.textContent = "打中狐狸了！牠偷的木頭掉下來了！";
    return;
  }

  messageText.textContent = "打中狐狸了！狐狸暫時變慢了！";
}

function isFoxInDen() {
  return distance(fox, foxDen) < foxDen.radius + fox.size;
}

function updateFoxDenWarning(deltaTime) {
  if (game.foxDenWarningCooldown > 0) {
    game.foxDenWarningCooldown = Math.max(0, game.foxDenWarningCooldown - deltaTime);
  }

  if (!game.carryingRock) return;

  const distanceToDen = distance(player, foxDen);

  if (distanceToDen < foxDen.radius + player.radius + 18) {
    game.carryingRock = false;
    rock.visible = true;
    rock.carried = false;
    rock.x = clamp(player.x, 80, 640);
    rock.y = clamp(player.y + 28, 80, 500);
    aim.active = false;
    pushPlayerAwayFromFoxDen();

    if (game.foxDenWarningCooldown === 0) {
      showGameAlert("不能侵門踏戶，打給動保喔!!!!");
      game.foxDenWarningCooldown = 2;
    }
  }
}

function pushPlayerAwayFromFoxDen() {
  const dx = player.x - foxDen.x;
  const dy = player.y - foxDen.y;
  const length = Math.hypot(dx, dy) || 1;
  const pushDistance = foxDen.radius + player.radius + 70;

  player.x = clamp(foxDen.x + (dx / length) * pushDistance, player.radius, canvas.width - player.radius);
  player.y = clamp(foxDen.y + (dy / length) * pushDistance, player.radius, canvas.height - player.radius);
}
function updateFoxHurt(deltaTime) {
  if (fox.hurtTime > 0) {
    fox.hurtTime = Math.max(0, fox.hurtTime - deltaTime);
  }
}

function updateFox(deltaTime) {
  if (fox.stealCooldown > 0) {
    fox.stealCooldown = Math.max(0, fox.stealCooldown - deltaTime);
    fox.state = "cooldown";
    moveFoxToPoint(foxDen, deltaTime);
    return;
  }

  if (game.score <= 0 && !fox.carryingWood) {
    fox.state = "idle";
    moveFoxToPoint(foxDen, deltaTime);
    return;
  }

  if (!fox.carryingWood && isPlayerGuardingCabin()) {
    fox.state = "scared";
    moveFoxToPoint(foxDen, deltaTime);
    return;
  }

  if (!fox.carryingWood) {
    fox.state = "goToCabin";
    moveFoxToPoint(getCabinCenter(), deltaTime);

    if (distance(fox, getCabinCenter()) < fox.stealRange) {
      fox.carryingWood = true;
      fox.stolenWoodIndex = getHiddenWoodIndexForFox();
      fox.state = "returnHome";
      messageText.textContent = "狐狸偷到木頭了，快阻止牠回窩！";
    }

    return;
  }

  if (fox.carryingWood) {
    fox.state = "returnHome";
    moveFoxToPoint(foxDen, deltaTime);

    if (distance(fox, foxDen) < foxDen.radius) {
      fox.carryingWood = false;
      game.score = Math.max(0, game.score - 1);
      updateHud();
      fox.stealCooldown = fox.stealCooldownDuration;
      fox.state = "cooldown";
      messageText.textContent = "狐狸把木頭搬回窩了！分數 -1";
    }
  }
}

function updateTornadoes(deltaTime) {
  tornadoes.forEach((tornado) => {
    tornado.spin += deltaTime * 8;

    if (tornado.chaseCooldown > 0) {
      tornado.chaseCooldown = Math.max(0, tornado.chaseCooldown - deltaTime);
    }

    const playerDistance = distance(player, tornado);
    const playerInSafeZone = isPlayerInCabinSafeZone();

    if (playerInSafeZone && tornado.mode === "chase") {
      tornado.mode = "patrol";
      tornado.chaseCooldown = tornado.chaseCooldownDuration;
    }

    if (
      !playerInSafeZone &&
      tornado.mode !== "chase" &&
      tornado.chaseCooldown === 0 &&
      playerDistance < tornado.chaseRange
    ) {
      tornado.mode = "chase";
      tornado.chaseTimer = tornado.chaseDuration;
    }
        if (tornado.mode === "chase") {
          chasePlayer(tornado, deltaTime);
          tornado.chaseTimer -= deltaTime;

          if (tornado.chaseTimer <= 0) {
            tornado.mode = "patrol";
            tornado.chaseCooldown = tornado.chaseCooldownDuration;
          }
        } else {
          patrolTornado(tornado, deltaTime);
        }

        tornado.x = clamp(tornado.x, tornado.minX, tornado.maxX);
        tornado.y = clamp(tornado.y, tornado.minY, tornado.maxY);
        pushTornadoAwayFromCabin(tornado);
  });
}


function pushTornadoAwayFromCabin(tornado) {
  const cabinCenter = getCabinCenter();
  const dx = tornado.x - cabinCenter.x;
  const dy = tornado.y - cabinCenter.y;
  const length = Math.hypot(dx, dy);

  const safeDistance = cabinSafeZone.radius + tornado.radius;

  if (length >= safeDistance || length === 0) return;

  tornado.x = cabinCenter.x + (dx / length) * safeDistance;
  tornado.y = cabinCenter.y + (dy / length) * safeDistance;
}

function chasePlayer(tornado, deltaTime) {
  const dx = player.x - tornado.x;
  const dy = player.y - tornado.y;
  const length = Math.hypot(dx, dy);

  if (length < 1) return;

  const currentSpeed = tornado.chaseSpeed * getTornadoSpeedMultiplier();

  tornado.x += (dx / length) * currentSpeed * deltaTime;
  tornado.y += (dy / length) * currentSpeed * deltaTime;
}

function patrolTornado(tornado, deltaTime) {
  if (woods.length === 0) return;

  const targetWood = woods[tornado.targetWoodIndex % woods.length];
  const patrolTarget = {
    x: clamp(targetWood.x + 34, tornado.minX, tornado.maxX),
    y: clamp(targetWood.y - 36, tornado.minY, tornado.maxY),
  };

  const dx = patrolTarget.x - tornado.x;
  const dy = patrolTarget.y - tornado.y;
  const length = Math.hypot(dx, dy);

  if (length < 8) {
    tornado.patrolTimer += deltaTime;

    if (tornado.patrolTimer >= tornado.patrolDuration) {
      tornado.targetWoodIndex = (tornado.targetWoodIndex + 1) % woods.length;
      tornado.patrolTimer = 0;
    }

    return;
  }

  tornado.patrolTimer = 0;
  const currentSpeed = tornado.speed * getTornadoSpeedMultiplier();

  tornado.x += (dx / length) * currentSpeed * deltaTime;
  tornado.y += (dy / length) * currentSpeed * deltaTime;
}

function getCabinCenter() {
  return {
    x: cabin.x + cabin.width / 2,
    y: cabin.y + cabin.height / 2,
  };
}

function isPlayerInCabinSafeZone() {
  return distance(player, getCabinCenter()) < cabinSafeZone.radius;
}

function isPlayerGuardingCabin() {
  return distance(player, getCabinCenter()) < fox.fearRange;
}

function isTouchOnPlayer(x, y) {
  return distance({ x, y }, player) < player.size * 0.9;
}

function moveFoxToCabin(deltaTime) {
  const cabinCenter = getCabinCenter();
  const dx = cabinCenter.x - fox.x;
  const dy = cabinCenter.y - fox.y;
  const length = Math.hypot(dx, dy);

  if (length < 1) return;

  fox.x += (dx / length) * fox.speed * deltaTime;
  fox.y += (dy / length) * fox.speed * deltaTime;
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
  const carriedWood = woods[game.carryingWoodIndex];

  game.carryingWood = false;
  game.carryingWoodIndex = null;

  if (carriedWood) {
    carriedWood.visible = true;
    carriedWood.x = clamp(player.x - 42, 60, 640);
    carriedWood.y = clamp(player.y + 24, 60, 500);
  }

  messageText.textContent = "被龍捲風吹到，木頭掉了！";
}
}

function moveFoxToPoint(target, deltaTime) {
  const dx = target.x - fox.x;
  const dy = target.y - fox.y;
  const length = Math.hypot(dx, dy);

  if (length < 1) return;

  const baseSpeed = fox.speed * getFoxSpeedMultiplier();
  const currentSpeed = fox.hurtTime > 0 ? baseSpeed * 0.5 : baseSpeed;

  fox.x += (dx / length) * currentSpeed * deltaTime;
  fox.y += (dy / length) * currentSpeed * deltaTime;
}

function movePlayer(deltaTime) {
  let moveX = 0;
  let moveY = 0;

  if (mobileMove.active) {
    const dx = mobileMove.targetX - player.x;
    const dy = mobileMove.targetY - player.y;
    const targetDistance = Math.hypot(dx, dy);

    if (targetDistance > 8) {
      moveX = dx / targetDistance;
      moveY = dy / targetDistance;
    }
  } else {
    if (keys.ArrowLeft || keys.a) moveX -= 1;
    if (keys.ArrowRight || keys.d) moveX += 1;
    if (keys.ArrowUp || keys.w) moveY -= 1;
    if (keys.ArrowDown || keys.s) moveY += 1;
  }

  if (moveX === 0 && moveY === 0) return;

  const length = Math.hypot(moveX, moveY);

  player.x += (moveX / length) * player.speed * deltaTime;
  player.y += (moveY / length) * player.speed * deltaTime;

  player.x = clamp(player.x, player.size / 2, canvas.width - player.size / 2);
  player.y = clamp(player.y, player.size / 2, canvas.height - player.size / 2);
}

function startMobileMove(touch) {
  const canvasPoint = getTouchPosition(touch);

  mobileMove.active = true;
  mobileMove.touchId = touch.identifier;
  mobileMove.targetX = canvasPoint.x;
  mobileMove.targetY = canvasPoint.y;
  mobileMove.startCanvasX = canvasPoint.x;
  mobileMove.startCanvasY = canvasPoint.y;
  mobileMove.moved = false;
}

function updateMobileMove(touch) {
  if (!mobileMove.active) return;

  const canvasPoint = getTouchPosition(touch);

  mobileMove.targetX = canvasPoint.x;
  mobileMove.targetY = canvasPoint.y;

  if (distance(
    { x: mobileMove.startCanvasX, y: mobileMove.startCanvasY },
    { x: canvasPoint.x, y: canvasPoint.y }
  ) > 10) {
    mobileMove.moved = true;
  }
}

function stopMobileMove() {
  mobileMove.active = false;
  mobileMove.touchId = null;
  mobileMove.moved = false;
}

function findTouchById(touchList, touchId) {
  for (let i = 0; i < touchList.length; i += 1) {
    if (touchList[i].identifier === touchId) {
      return touchList[i];
    }
  }

  return null;
}

function getTouchScreenPosition(touch) {
  return {
    x: touch.clientX,
    y: touch.clientY,
  };
}

function isTouchOnPickupObject(x, y) {
  const tappedWood = woods.some((wood) => {
    return wood.visible && distance({ x, y }, wood) < 95;
  });

  const tappedRock = rock.visible && distance({ x, y }, rock) < 110;

  return tappedWood || tappedRock;
}

function handleMobileTap(x, y) {
  if (!game.running) return;

  if (game.carryingWood && isPointInCabin(x, y)) {
    if (!isPlayerInCabin()) {
      messageText.textContent = "靠近小屋後再點小屋放木頭。";
      return;
    }

    const carriedWood = woods[game.carryingWoodIndex];

    game.carryingWood = false;
    game.carryingWoodIndex = null;
    game.carryingWoodCount = 0;
    game.carryingWoodIndexes = [];

    game.score += 1;
    game.deliveredWoodCount += 1;

    if (carriedWood) {
      spawnWood(carriedWood);
    }

    updateHud();

    if (!game.hasBag && game.deliveredWoodCount >= 3) {
      messageText.textContent = "成功放下木頭，分數 +1！";
      unlockBagIfNeeded();
      return;
    }

    messageText.textContent = "成功放下木頭，分數 +1！";
    return;
    }

  const tappedWoodIndex = woods.findIndex((wood) => {
  return wood.visible && distance({ x, y }, wood) < 85;
  });

  if (!game.carryingWood && tappedWoodIndex !== -1) {
    if (distance(player, woods[tappedWoodIndex]) > 120) {
      messageText.textContent = "離木頭太遠了，靠近一點再點木頭。";
      return;
    }

    game.carryingWood = true;
    game.carryingWoodIndex = tappedWoodIndex;
    game.carryingWoodCount = 1;
    game.carryingWoodIndexes = [tappedWoodIndex];
    woods[tappedWoodIndex].visible = false;
    messageText.textContent = "撿到木頭了，快搬回小屋！";
    return;
  }

  if (rock.visible && distance({ x, y }, rock) < 90) {
    if (distance(player, rock) > 120) {
      messageText.textContent = "離石頭太遠了，靠近一點再點石頭。";
      return;
    }

    pickUpRock();
  }
}

function pickUpRock() {
  if (!game.running) return;

  if (game.carryingRock) {
    messageText.textContent = "你已經拿著石頭了。";
    return;
  }

  if (!rock.visible) {
    messageText.textContent = "目前場上沒有石頭。";
    return;
  }

  if (distance(player, rock) > 120) {
  messageText.textContent = "離石頭太遠了，靠近一點再點石頭。";
  return;
}

  game.carryingRock = true;
  rock.visible = false;
  messageText.textContent = "撿起石頭了！按住右下角石頭按鈕瞄準狐狸。";
  updateThrowButton();
}

function throwRock(targetX, targetY) {
  const dx = targetX - player.x;
  const dy = targetY - player.y;
  const length = Math.hypot(dx, dy);

  if (length < 1) return;

  const speed = 520;

  thrownRock.x = player.x;
  thrownRock.y = player.y;
  thrownRock.startX = player.x;
  thrownRock.startY = player.y;
  thrownRock.vx = (dx / length) * speed;
  thrownRock.vy = (dy / length) * speed;
  thrownRock.active = true;

  game.carryingRock = false;
  updateThrowButton();
  messageText.textContent = "石頭丟出去了！";
}

function dropStolenWood() {
  let stolenWood = woods[fox.stolenWoodIndex];

  if (!stolenWood) {
    stolenWood = woods.find((wood) => !wood.visible) || woods[0];
  }

  if (!stolenWood) return;

  stolenWood.visible = true;
  stolenWood.x = clamp(fox.x + 24, 60, 640);
  stolenWood.y = clamp(fox.y + 24, 60, 500);
}

function getHiddenWoodIndexForFox() {
  const hiddenIndex = woods.findIndex((wood) => !wood.visible);

  if (hiddenIndex !== -1) {
    return hiddenIndex;
  }

  return null;
}

function unlockBagIfNeeded() {
  if (game.hasBag || game.bagAlertShown) return;
  if (game.deliveredWoodCount < 3) return;

  game.hasBag = true;
  game.bagAlertShown = true;

  showGameAlert("獲得包包！現在可以一次搬 3 根木頭。");
}

function interact() {
  if (!game.running) return;

  if (!game.carryingWood) {
  const woodIndex = woods.findIndex((wood) => {
    return wood.visible && distance(player, wood) < 46;
  });

  if (woodIndex !== -1) {
    game.carryingWood = true;
    game.carryingWoodIndex = woodIndex;
    woods[woodIndex].visible = false;
    messageText.textContent = "撿到木頭了，快搬回小屋！";
    return;
  }
}

  if (game.carryingWood && isPlayerInCabin()) {
  const carriedWood = woods[game.carryingWoodIndex];

  game.carryingWood = false;
  game.carryingWoodIndex = null;
  game.score += 1;

  if (carriedWood) {
    spawnWood(carriedWood);
  }

  updateHud();
  messageText.textContent = "成功放下木頭，分數 +1！";
}
}

function spawnAllWoods() {
  woods.forEach((wood) => {
    spawnWood(wood);
  });
}

function spawnWood(wood) {
  wood.visible = true;
  wood.x = randomBetween(spawnArea.minX, spawnArea.maxX);
  wood.y = randomBetween(spawnArea.minY, spawnArea.maxY);
}

function startRockRespawn() {
  rock.visible = false;
  rock.carried = false;
  rock.respawnTimer = randomBetween(3, 5);
}

function isPointInCabin(x, y) {
  const padding = 80;

  return (
    x > cabin.x - padding &&
    x < cabin.x + cabin.width + padding &&
    y > cabin.y - padding &&
    y < cabin.y + cabin.height + padding
  );
}

function isPlayerInCabin() {
  const padding = 100;

  return (
    player.x > cabin.x - padding &&
    player.x < cabin.x + cabin.width + padding &&
    player.y > cabin.y - padding &&
    player.y < cabin.y + cabin.height + padding
  );
}

function updateHud() {
  timeText.textContent = Math.ceil(game.timeLeft);
  scoreText.textContent = game.score;
  updateThrowButton();
}

function updateThrowButton() {
  if (!throwButton) return;

  if (game.carryingRock && game.running) {
    throwButton.classList.remove("hidden");
  } else {
    throwButton.classList.add("hidden");
  }
}

function updateThrowButtonState() {
  if (!throwButton) return;

  throwButton.classList.toggle("aiming", mobileThrow.active);
  throwButton.classList.toggle("ready", mobileThrow.active && mobileThrow.power >= mobileThrow.minPower);
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
  if (!rankingList) return;
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

function renderMobileRanking() {
  if (!mobileRankingList) return;

  const ranking = loadRanking();
  mobileRankingList.innerHTML = "";

  if (ranking.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "目前還沒有紀錄。";
    mobileRankingList.appendChild(emptyItem);
    return;
  }

  ranking.forEach((record) => {
    const item = document.createElement("li");
    item.textContent = `${record.name}：${record.score} 分`;
    mobileRankingList.appendChild(item);
  });
}

function showMobileResult(playerName, score) {
  if (!mobileResultScreen) {
    messageText.textContent = `遊戲結束！${playerName} 本局分數：${score}。`;
    return;
  }

  if (finalScoreText) {
    finalScoreText.textContent = `${playerName} 本局分數：${score}`;
  }

  renderMobileRanking();
  mobileResultScreen.classList.remove("hidden");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (assets.background.complete) {
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);
  } else {
    drawGround();
  }

  woods.forEach((wood) => {
  if (wood.visible) {
    drawWood(wood.x, wood.y);
  }
  });

  drawFoxDen();

  if (rock.visible) {
    drawRock(rock.x, rock.y);
  }

  if (thrownRock.active) {
  drawRock(thrownRock.x, thrownRock.y);
  }

  if (reflectedRock.active) {
  drawRock(reflectedRock.x, reflectedRock.y);
  }

  if (aim.active) {
    drawAimLine();
  }

  tornadoes.forEach(drawTornado);
  drawFox(fox.x, fox.y);

  if (shouldShowFoxWarning()) {
    drawFoxWarning(fox.x, fox.y);
  }

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

function drawRock(x, y) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 244, 180, 0.45)";
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 44, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  if (assets.rock.complete) {
    drawImageCentered(assets.rock, x, y, 70, 48);
  } else {
    ctx.fillStyle = "#777";
    ctx.beginPath();
    ctx.ellipse(x, y, 30, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }

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

function drawFoxDen() {
  if (assets.foxDen.complete) {
    drawImageCentered(assets.foxDen, foxDen.x, foxDen.y, 190, 140);
    return;
  }

  ctx.save();

  ctx.fillStyle = "rgba(80, 55, 35, 0.9)";
  ctx.beginPath();
  ctx.ellipse(foxDen.x, foxDen.y, 48, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(35, 25, 18, 0.95)";
  ctx.beginPath();
  ctx.ellipse(foxDen.x, foxDen.y + 4, 28, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFox(x, y) {
  const isHurt = fox.hurtTime > 0;

  if (isHurt) {
    ctx.save();
    ctx.globalAlpha = 0.55 + Math.sin(Date.now() / 80) * 0.25;
  }

  if (assets.fox.complete) {
    drawImageCentered(assets.fox, x, y, 72, 40);

    if (fox.carryingWood) {
      drawWood(x, y - 34);
    }

    if (isHurt) {
      ctx.restore();
    }

    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#d6792f";
  ctx.beginPath();
  ctx.ellipse(0, 8, 36, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(16, 8, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  if (fox.carryingWood) {
    drawWood(0, -34);
  }

  ctx.restore();

  if (isHurt) {
    ctx.restore();
  }
}

function shouldShowFoxWarning() {
  return (
    fox.carryingWood ||
    fox.state === "goToCabin" ||
    fox.state === "returnHome" ||
    distance(fox, foxDen) > foxDen.radius + 20
  );
}

function drawFoxWarning(x, y) {
  if (assets.foxAlert.complete) {
    drawImageCentered(assets.foxAlert, x, y - 56, 42, 42);
    return;
  }

  ctx.save();
  ctx.fillStyle = "#ff4d2d";
  ctx.strokeStyle = "#fff7d6";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y - 48, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Microsoft JhengHei";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("!", x, y - 49);
  ctx.restore();
}
function drawAimLine() {
  const target = getLimitedAimTarget();

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);

  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(target.x, target.y);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(255, 220, 120, 0.85)";
  ctx.beginPath();
  ctx.arc(target.x, target.y, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function getTouchPosition(touch) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (touch.clientX - rect.left) * (canvas.width / rect.width),
    y: (touch.clientY - rect.top) * (canvas.height / rect.height),
  };
}

function getThrowDirectionFromButton(touch) {
  const rect = throwButton.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = touch.clientX - centerX;
  const dy = touch.clientY - centerY;
  const length = Math.hypot(dx, dy);

  mobileThrow.power = length;

  if (length < mobileThrow.minPower) {
    return {
      x: player.x,
      y: player.y,
    };
  }

  return {
    x: player.x + (dx / length) * aim.maxRange,
    y: player.y + (dy / length) * aim.maxRange,
  };
}

function getLimitedAimTarget() {
  const dx = aim.mouseX - player.x;
  const dy = aim.mouseY - player.y;
  const length = Math.hypot(dx, dy);

  if (length <= aim.maxRange) {
    return {
      x: aim.mouseX,
      y: aim.mouseY,
    };
  }

  return {
    x: player.x + (dx / length) * aim.maxRange,
    y: player.y + (dy / length) * aim.maxRange,
  };
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

  if (game.carryingRock) {
  drawRock(player.x + 24, player.y - 46);
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

  if (event.key === "e" || event.key === "E") {
    event.preventDefault();
    pickUpRock();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

if (exitGameButton) {
  exitGameButton.addEventListener("click", exitGame);
}

showNameButton.addEventListener("click", function () {
  startScreen.classList.add("hidden");
  tutorialScreen.classList.remove("hidden");
});

tutorialContinueButton.addEventListener("click", function () {
  tutorialScreen.classList.add("hidden");
  nameScreen.classList.remove("hidden");
  playerNameInput.focus();
});

confirmNameButton.addEventListener("click", startGame);

playerNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    startGame();
  }
});

if (restartButton) {
  restartButton.addEventListener("click", startGame);
}

if (mobileRestartButton) {
  mobileRestartButton.addEventListener("click", function () {
    if (mobileResultScreen) {
      mobileResultScreen.classList.add("hidden");
    }
    startGame();
  });
}

if (mobileHomeButton) {
  mobileHomeButton.addEventListener("click", goHome);
}

if (mobileCloseGameButton) {
  mobileCloseGameButton.addEventListener("click", goHome);
}

closeAlertButton.addEventListener("click", function () {
  gameAlert.classList.add("hidden");
});

resetGame();

if (rankingList) {
  renderRanking();
}

canvas.addEventListener("mousedown", (event) => {
  if (!game.running) return;
  if (!game.carryingRock) return;
  if (event.button !== 0) return;

  aim.active = true;

  const mouse = getMousePosition(event);
  aim.mouseX = mouse.x;
  aim.mouseY = mouse.y;
});

canvas.addEventListener("mousemove", (event) => {
  if (!aim.active) return;

  const mouse = getMousePosition(event);
  aim.mouseX = mouse.x;
  aim.mouseY = mouse.y;
});

canvas.addEventListener("mouseup", (event) => {
  if (!aim.active) return;

  const target = getLimitedAimTarget();
  throwRock(target.x, target.y);

  aim.active = false;
});

// 先暫時關掉點擊互動，等 joystick 可以移動後再接回來
// canvas.addEventListener("touchend", (event) => {
//   if (!game.running) return;
//   if (event.changedTouches.length === 0) return;
//
//   const touch = event.changedTouches[0];
//   const point = getTouchPosition(touch);
//
//   handleMobileTap(point.x, point.y);
//
//   event.preventDefault();
// });

canvas.addEventListener("touchend", (event) => {
  if (!game.running) return;

  const endedMoveTouch = findTouchById(event.changedTouches, mobileMove.touchId);

  if (endedMoveTouch) {
    stopMobileMove();
    event.preventDefault();
    return;
  }

  const endedTapTouch = findTouchById(event.changedTouches, mobileTap.touchId);

  if (endedTapTouch) {
    handleMobileTap(mobileTap.x, mobileTap.y);

    mobileTap.active = false;
    mobileTap.touchId = null;
    event.preventDefault();
  }
});

canvas.addEventListener("touchcancel", (event) => {
  const canceledMoveTouch = findTouchById(event.changedTouches, mobileMove.touchId);

  if (canceledMoveTouch) {
    stopMobileMove();
  }

  const canceledTapTouch = findTouchById(event.changedTouches, mobileTap.touchId);

  if (canceledTapTouch) {
    mobileTap.active = false;
    mobileTap.touchId = null;
  }

  event.preventDefault();
});

canvas.addEventListener("touchstart", (event) => {
  if (!game.running) return;
  if (event.changedTouches.length === 0) return;

  const touch = event.changedTouches[0];
  const point = getTouchPosition(touch);

  if (isTouchOnPickupObject(point.x, point.y)) {
  if (!mobileTap.active) {
    mobileTap.active = true;
    mobileTap.touchId = touch.identifier;
    mobileTap.x = point.x;
    mobileTap.y = point.y;
  }

  event.preventDefault();
  return;
  }

  if (isTouchOnPlayer(point.x, point.y) && !mobileMove.active) {
    startMobileMove(touch);
    event.preventDefault();
    return;
  }

  if (!mobileTap.active) {
    mobileTap.active = true;
    mobileTap.touchId = touch.identifier;
    mobileTap.x = point.x;
    mobileTap.y = point.y;
  }

  event.preventDefault();
});

canvas.addEventListener("touchmove", (event) => {
  if (!game.running) return;
  if (!mobileMove.active) return;

  const touch = findTouchById(event.touches, mobileMove.touchId);

  if (!touch) return;

  updateMobileMove(touch);

  event.preventDefault();
});

if (throwButton) {
  throwButton.addEventListener("touchstart", (event) => {
  if (!game.running) return;
  if (!game.carryingRock) return;
  if (event.changedTouches.length === 0) return;
  if (mobileThrow.active) return;

  const touch = event.changedTouches[0];

  mobileThrow.active = true;
  mobileThrow.touchId = touch.identifier;
  aim.active = true;
  mobileThrow.power = 0;
  updateThrowButtonState();

  const target = getThrowDirectionFromButton(touch);

  aim.mouseX = target.x;
  aim.mouseY = target.y;

  event.preventDefault();
  });

  throwButton.addEventListener("touchmove", (event) => {
  if (!mobileThrow.active) return;

  const touch = findTouchById(event.touches, mobileThrow.touchId);

  if (!touch) return;

  const target = getThrowDirectionFromButton(touch);

  aim.mouseX = target.x;
  aim.mouseY = target.y;
  updateThrowButtonState();

  event.preventDefault();
  });

  throwButton.addEventListener("touchend", (event) => {
  if (!mobileThrow.active) return;

  const endedThrowTouch = findTouchById(event.changedTouches, mobileThrow.touchId);

  if (!endedThrowTouch) return;

  if (mobileThrow.power >= mobileThrow.minPower) {
    const target = getLimitedAimTarget();
    throwRock(target.x, target.y);
  } else {
    messageText.textContent = "拖曳方向後再放開，才會丟出石頭。";
  }

  mobileThrow.active = false;
  mobileThrow.touchId = null;
  mobileThrow.power = 0;
  aim.active = false;
  updateThrowButtonState();

  event.preventDefault();
  });

  throwButton.addEventListener("touchcancel", (event) => {
  const canceledThrowTouch = findTouchById(event.changedTouches, mobileThrow.touchId);

  if (!canceledThrowTouch) return;

  mobileThrow.active = false;
  mobileThrow.touchId = null;
  mobileThrow.power = 0;
  aim.active = false;
  updateThrowButtonState();

  event.preventDefault();
  });
}



