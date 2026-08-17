/* =========================
   TELAS
========================= */

const screens = {

  home:
    document.getElementById("home"),

  game:
    document.getElementById("game"),

  finish:
    document.getElementById("finish")

};


/* =========================
   ELEMENTOS
========================= */

const mazeEl =
  document.getElementById("maze");

const startBtn =
  document.getElementById("startBtn");

const restartBtn =
  document.getElementById("restartBtn");

const musicBtn =
  document.getElementById("musicBtn");

const music =
  document.getElementById("music");


/* =========================
   MÚSICA
========================= */

music.volume = 1;


/*
  Essa variável indica se o navegador
  permitiu que a música fosse iniciada
  durante a interação inicial.
*/

let musicReady = false;


/* =========================
   LABIRINTO
========================= */

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


let player = {

  row: 1,

  col: 1

};


let goal = {

  row: 9,

  col: 13

};


/* =========================
   MOSTRAR TELA
========================= */

function showScreen(name) {

  Object.values(screens).forEach(screen => {

    screen.classList.remove("active");

  });

  screens[name].classList.add("active");

}


/* =========================
   CONSTRUIR LABIRINTO
========================= */

function buildMaze() {

  mazeEl.innerHTML = "";


  maze.forEach((row, r) => {

    [...row].forEach((value, c) => {

      const cell =
        document.createElement("div");

      cell.className =
        "cell " +
        (value === "1"
          ? "wall"
          : "path");


      cell.dataset.row = r;
      cell.dataset.col = c;


      /*
        PERSONAGEM DA JOGADORA
      */

      if (
        r === player.row &&
        c === player.col
      ) {

        cell.innerHTML =
          '<span class="player">👩🏻</span>';

      }


      /*
        VOCÊ NO FINAL
      */

      if (
        r === goal.row &&
        c === goal.col
      ) {

        const img =
          document.createElement("img");

        img.src = "2.jpeg";

        img.alt = "Meu personagem";

        img.className = "goal";

        cell.appendChild(img);

      }


      mazeEl.appendChild(cell);

    });

  });

}


/* =========================
   INICIAR / REINICIAR JOGO
========================= */

function resetGame() {

  player = {

    row: 1,

    col: 1

  };


  buildMaze();

  showScreen("game");


  /*
    Tenta iniciar a música enquanto
    ainda existe uma interação da usuária.

    O volume fica praticamente inaudível
    durante o jogo.
  */

  music.volume = 0.01;


  const playPromise =
    music.play();


  if (playPromise !== undefined) {

    playPromise
      .then(() => {

        musicReady = true;

      })
      .catch(() => {

        musicReady = false;

      });

  }

}


/* =========================
   VERIFICAR MOVIMENTO
========================= */

function canMove(row, col) {

  return (

    row >= 0 &&

    row < maze.length &&

    col >= 0 &&

    col < maze[0].length &&

    maze[row][col] !== "1"

  );

}


/* =========================
   MOVIMENTAR
========================= */

function move(dr, dc) {

  const nextRow =
    player.row + dr;

  const nextCol =
    player.col + dc;


  if (
    !canMove(
      nextRow,
      nextCol
    )
  ) {

    return;

  }


  player.row =
    nextRow;

  player.col =
    nextCol;


  buildMaze();


  /*
    CHEGOU ATÉ VOCÊ ❤️
  */

  if (

    player.row === goal.row &&

    player.col === goal.col

  ) {

    setTimeout(() => {

      showScreen("finish");

      createFinalHearts();


      /*
        Agora mostramos a música.

        Se ela já estava tocando silenciosamente,
        simplesmente aumentamos o volume.

        Se o navegador não permitiu o autoplay,
        tentamos tocar novamente.
      */

      music.volume = 1;


      if (!musicReady) {

        music
          .play()
          .then(() => {

            musicReady = true;

            musicBtn.textContent =
              "⏸️ pausar nossa música";

          })
          .catch(() => {

            /*
              Se o navegador bloquear,
              o botão continua disponível.
            */

            musicBtn.textContent =
              "🎵 tocar nossa música";

          });

      } else {

        musicBtn.textContent =
          "⏸️ pausar nossa música";

      }

    }, 500);

  }

}


/* =========================
   TECLADO
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      !screens.game.classList.contains(
        "active"
      )
    ) {

      return;

    }


    const key =
      event.key.toLowerCase();


    if (
      key === "arrowup" ||
      key === "w"
    ) {

      event.preventDefault();

      move(-1, 0);

    }


    if (
      key === "arrowdown" ||
      key === "s"
    ) {

      event.preventDefault();

      move(1, 0);

    }


    if (
      key === "arrowleft" ||
      key === "a"
    ) {

      event.preventDefault();

      move(0, -1);

    }


    if (
      key === "arrowright" ||
      key === "d"
    ) {

      event.preventDefault();

      move(0, 1);

    }

  }

);


/* =========================
   BOTÕES CELULAR
========================= */

document
  .querySelectorAll("[data-move]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const direction =
          button.dataset.move;


        if (
          direction === "up"
        ) {

          move(-1, 0);

        }


        if (
          direction === "down"
        ) {

          move(1, 0);

        }


        if (
          direction === "left"
        ) {

          move(0, -1);

        }


        if (
          direction === "right"
        ) {

          move(0, 1);

        }

      }
    );

  });


/* =========================
   CORAÇÕES FINAIS
========================= */

function createFinalHearts() {

  document
    .querySelectorAll(".final-heart")
    .forEach(el => el.remove());


  for (
    let i = 0;
    i < 22;
    i++
  ) {

    const heart =
      document.createElement("div");


    heart.className =
      "final-heart";


    heart.textContent =
      Math.random() > .5
        ? "♥"
        : "♡";


    Object.assign(
      heart.style,
      {

        left:
          Math.random() *
          100 +
          "vw",

        bottom:
          "-30px",

        color:
          "#e56b8d",

        opacity:
          .25 +
          Math.random() * .5,

        fontSize:
          15 +
          Math.random() * 25 +
          "px",

        animation:
          `rise ${
            4 +
            Math.random() * 4
          }s linear forwards`

      }
    );


    document.body
      .appendChild(heart);


    setTimeout(
      () => heart.remove(),
      8500
    );

  }

}


/* =========================
   ANIMAÇÃO DOS CORAÇÕES
========================= */

const animationStyle =
  document.createElement("style");


animationStyle.textContent = `

@keyframes rise {

  from {

    transform:
      translateY(0)
      rotate(0deg);

  }

  to {

    transform:
      translateY(-110vh)
      rotate(25deg);

    opacity: 0;

  }

}

`;


document.head
  .appendChild(animationStyle);


/* =========================
   COMEÇAR
========================= */

startBtn.addEventListener(
  "click",
  () => {

    resetGame();

  }

);


/* =========================
   JOGAR NOVAMENTE
========================= */

restartBtn.addEventListener(
  "click",
  () => {

    music.pause();

    music.currentTime = 0;

    musicReady = false;

    resetGame();

  }

);


/* =========================
   BOTÃO DA MÚSICA
========================= */

musicBtn.addEventListener(
  "click",
  async () => {

    try {

      if (
        music.paused
      ) {

        music.volume = 1;

        await music.play();

        musicReady = true;

        musicBtn.textContent =
          "⏸️ pausar nossa música";

      } else {

        music.pause();

        musicBtn.textContent =
          "🎵 tocar nossa música";

      }

    } catch (error) {

      musicBtn.textContent =
        "🎵 toque novamente para ouvir";

    }

  }

);


/* =========================
   INICIALIZAÇÃO
========================= */

buildMaze();
