import { CellConfiguration, DishConfiguration } from "./classes/config.js";
import { Dish } from "./classes/dish.js";
import { Cell } from "./classes/cell.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let gameState = "ready";

const dishConfiguration = new DishConfiguration(3, 5, 500);
const dish = new Dish(canvas, dishConfiguration);

const population = document.getElementById("population");
const startButton = document.getElementById("start");
const cancelButton = document.getElementById("cancel");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - window.innerHeight / 4;

function animate() {
  if (gameState === "running") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dish.energyCheck();
    dish.killCells();
    if (dish.cells.length < dish.configuration.maxPopulation) {
      dish.spawnCheck();
    }
    dish.update();
    dish.checkCollisionsWithBorders();
    dish.checkCollisions();
    dish.killCells();
    dish.drawCells(ctx);

    population.innerText = dish.cells.length;

    requestAnimationFrame(animate);
  } else {
    return;
  }
}

canvas.addEventListener("mousedown", (e) => {
  dish.seed(e.offsetX, e.offsetY);
  dish.drawCells(ctx);
});

startButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (gameState === "running") {
    gameState = "paused";
    e.target.innerText = "Start";
    console.log(dish);
    return;
  } else if (gameState === "paused") {
    gameState = "running";
    e.target.innerText = "Stop";
    animate();
  } else {
    gameState = "running";
    e.target.innerText = "Stop";
    animate();
  }
});

cancelButton.addEventListener("click", (e) => {
  dish.cells = [];
  gameState = "ready";
  startButton.innerText = "Start";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
