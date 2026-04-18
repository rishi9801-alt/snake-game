const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");
const themeToggle = document.getElementById("themeToggle");

const box = 20;
let score, snake, direction, food, game, gameStarted;
let highScore = localStorage.getItem("highScore") || 0;

function initGame() {
  score = 0;
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  gameStarted = false;

  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };

  updateScore();

  if (game) clearInterval(game);
  game = setInterval(draw, 150);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += box) {
    for (let x = 0; x < canvas.width; x += box) {
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.strokeRect(x, y, box, box);
    }
  }

  for (let i = 0; i < snake.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = i === 0 ? "#00ff88" : "#00cc66"; // head vs body
    ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (i === 0) {
      ctx.fillStyle = "#000";
      let eyeOffset = 4;
      if (direction === "LEFT" || direction === "RIGHT") {
        ctx.beginPath();
        ctx.arc(snake[i].x + 6, snake[i].y + 6, 2, 0, Math.PI * 2);
        ctx.arc(snake[i].x + 6, snake[i].y + box - 6, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(snake[i].x + 6, snake[i].y + 6, 2, 0, Math.PI * 2);
        ctx.arc(snake[i].x + box - 6, snake[i].y + 6, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.closePath();
    }
  }

  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  if (!gameStarted || direction === null) return;

  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(game);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    alert(`Game Over!\nScore: ${score}\nHigh Score: ${highScore}`);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }
}

function collision(head, body) {
  return body.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
}

function updateScore() {
  scoreEl.innerText = `Score: ${score} | High Score: ${highScore}`;
}

function changeDirection(event) {
  if (!gameStarted) gameStarted = true;
  switch (event.key) {
    case "ArrowUp": if (direction !== "DOWN") direction = "UP"; break;
    case "ArrowDown": if (direction !== "UP") direction = "DOWN"; break;
    case "ArrowLeft": if (direction !== "RIGHT") direction = "LEFT"; break;
    case "ArrowRight": if (direction !== "LEFT") direction = "RIGHT"; break;
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", initGame);
themeToggle.addEventListener("click", toggleTheme);

initGame();
