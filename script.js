const screens = {
  home: document.getElementById("home"),
  game: document.getElementById("game"),
  finish: document.getElementById("finish")
};

const mazeEl = document.getElementById("maze");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const musicBtn = document.getElementById("musicBtn");
const music = document.getElementById("music");

/*
  1 = parede
  0 = caminho
  P = início
  G = chegada

  O labirinto é simples de propósito.
*/
const maze = [
  "111111111111111",
  "1P000100000001",
  "101110111111101",
  "100010100000001",
  "111010101111101",
  "100010101000001",
  "101110101011111",
  "100000101000001",
  "101111101110101",
  "1000000000000G1",
  "111111111111111"
];

let player = { row: 1, col: 1 };
let goal = { row: 9, col: 13 };

function showScreen(name) {
  Object.values(screens).forEach(screen => {
    screen.classList.remove("active");
  });
  screens[name].classList.add("active");
}

function buildMaze() {
  mazeEl.innerHTML = "";

  maze.forEach((row, r) => {
    [...row].forEach((value, c) => {
      const cell = document.createElement("div");
      cell.className = "cell " + (value === "1" ? "wall" : "path");
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (r === player.row && c === player.col) {
        cell.innerHTML = '<span class="player">👩🏻</span>';
      }

      if (r === goal.row && c === goal.col) {
        cell.innerHTML = '<span class="goal">💗</span>';
      }

      mazeEl.appendChild(cell);
    });
  });
}

function resetGame() {
  player = { row: 1, col: 1 };
  buildMaze();
  showScreen("game");
}

function canMove(row, col) {
  return (
    row >= 0 &&
    row < maze.length &&
    col >= 0 &&
    col < maze[0].length &&
    maze[row][col] !== "1"
  );
}

function move(dr, dc) {
  const nextRow = player.row + dr;
  const nextCol = player.col + dc;

  if (!canMove(nextRow, nextCol)) {
    return;
  }

  player.row = nextRow;
  player.col = nextCol;

  buildMaze();

  if (player.row === goal.row && player.col === goal.col) {
    setTimeout(() => {
      showScreen("finish");
      createFinalHearts();
    }, 450);
  }
}

document.addEventListener("keydown", event => {
  if (!screens.game.classList.contains("active")) return;

  const key = event.key.toLowerCase();

  if (["arrowup", "w"].includes(key)) {
    event.preventDefault();
    move(-1, 0);
  }

  if (["arrowdown", "s"].includes(key)) {
    event.preventDefault();
    move(1, 0);
  }

  if (["arrowleft", "a"].includes(key)) {
    event.preventDefault();
    move(0, -1);
  }

  if (["arrowright", "d"].includes(key)) {
    event.preventDefault();
    move(0, 1);
  }
});

document.querySelectorAll("[data-move]").forEach(button => {
  button.addEventListener("click", () => {
    const direction = button.dataset.move;

    if (direction === "up") move(-1, 0);
    if (direction === "down") move(1, 0);
    if (direction === "left") move(0, -1);
    if (direction === "right") move(0, 1);
  });
});

function createFinalHearts() {
  document.querySelectorAll(".final-heart").forEach(el => el.remove());

  for (let i = 0; i < 22; i++) {
    const heart = document.createElement("div");
    heart.className = "final-heart";
    heart.textContent = Math.random() > .5 ? "♥" : "♡";

    Object.assign(heart.style, {
      position: "fixed",
      left: Math.random() * 100 + "vw",
      bottom: "-30px",
      color: "#e56b8d",
      opacity: .25 + Math.random() * .5,
      fontSize: 15 + Math.random() * 25 + "px",
      pointerEvents: "none",
      zIndex: 1,
      animation: `rise ${4 + Math.random() * 4}s linear forwards`
    });

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8500);
  }
}

const animationStyle = document.createElement("style");
animationStyle.textContent = `
@keyframes rise {
  from {
    transform: translateY(0) rotate(0deg);
  }
  to {
    transform: translateY(-110vh) rotate(25deg);
    opacity: 0;
  }
}`;
document.head.appendChild(animationStyle);

startBtn.addEventListener("click", resetGame);
restartBtn.addEventListener("click", () => {
  music.pause();
  music.currentTime = 0;
  resetGame();
});

musicBtn.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicBtn.textContent = "⏸️ pausar nossa música";
    } else {
      music.pause();
      musicBtn.textContent = "🎵 tocar nossa música";
    }
  } catch {
    musicBtn.textContent = "🎵 coloque sua música em assets/musica.mp3";
  }
});

buildMaze();
