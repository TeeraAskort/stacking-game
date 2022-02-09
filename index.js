let canvas;
let ctx;
let puntH2;
let resetBtn;
let squares = [
  {
    posX: 0,
    posY: 550,
    width: 150,
    height: 50,
  },
];
let puntuation = 0;
let speed = 10;
let iterations = 0;

let color = "#007fff";

let animationId;
let over = false;

function draw() {
  if (canvas.getContext) {
    ctx.clearRect(0, 0, 600, 600);
    squares.forEach((square) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(square.posX, square.posY);
      ctx.fillRect(square.posX, square.posY, square.width, square.height);
    });

    let square = squares[squares.length - 1];
    square.posX += speed;
    if (square.posX > 600 - square.width || square.posX < 0) {
      speed = -speed;
    }

    animationId = window.requestAnimationFrame(draw);
  }
}

function drawPoints() {
  puntH2.innerText = "Puntuation: " + puntuation;
}

function gameOver() {
  puntH2.innerText = "Game Over (Total points: " + puntuation + ")";
}

function click() {
  if (!over) {
    if (squares.length > 1) {
      let square = squares[squares.length - 1];
      let btmSquare = squares[squares.length - 2];
      if (
        (square.posX >= btmSquare.posX &&
          square.posX <= btmSquare.posX + btmSquare.width) ||
        (square.posX + square.width >= btmSquare.posX &&
          square.posX + square.width <= btmSquare.posX + btmSquare.width)
      ) {
        puntuation += 20;
        let width = 0;
        if (
          square.posX >= btmSquare.posX &&
          square.posX + square.width <= btmSquare.posX + btmSquare.width
        ) {
          width = square.width;
        } else if (
          square.posX >= btmSquare.posX &&
          square.posX <= btmSquare.posX + btmSquare.width
        ) {
          width = square.width - (square.posX - btmSquare.posX);
        } else {
          width = square.width - (btmSquare.posX - square.posX);
        }
        if (width < 10) {
          window.cancelAnimationFrame(animationId);
          gameOver();
          over = true;
        } else {
          squares.push({
            posX: square.posX,
            posY: square.posY - 50,
            width: width,
            height: 50,
          });
          if (squares.length > 5) {
            squares.splice(0, 1);
            squares.forEach((sq) => {
              sq.posY += 50;
            });
          }
          drawPoints();
        }
      } else {
        window.cancelAnimationFrame(animationId);
        gameOver();
        over = true;
      }
    } else {
      let lastSquare = squares[0];
      squares.push({
        posX: lastSquare.posX,
        posY: lastSquare.posY - 50,
        height: 50,
        width: 150,
      });
      puntuation += 20;
      drawPoints();
    }
  }
}

function inicializar() {
  canvas = document.querySelector("#canvas");
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
  }
  puntH2 = document.querySelector("#puntuation");
  resetBtn = document.querySelector("#reset");
  draw();
  canvas.addEventListener("click", click);
  window.addEventListener("keydown", (event) => {
    if (!event) event = window.event;
    if (event.code === "Space") {
      click();
      event.preventDefault();
    }
  });
  resetBtn.addEventListener("click", () => {
    squares = [
      {
        posX: 0,
        posY: 550,
        width: 150,
        height: 50,
      },
    ];
    puntuation = 0;
    drawPoints();
    window.cancelAnimationFrame(animationId);
    draw();
    over = false;
  });
}

document.addEventListener("DOMContentLoaded", inicializar);
