import { Cell } from "./classes/cell.js";
import { Configuration } from "./classes/config.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const population = document.getElementById("population");
const startButton = document.getElementById("start");
const seedButton = document.getElementById("seed");
const resetButton = document.getElementById("cancel");
const inputs = document.getElementsByTagName("input");
let gameState = "ready";

let defaultConfiguration = {
  dish: {
    countOfCells: 1,
    maxPopulation: 500,
  },
  energyRules: {
    startEnergyModificator: 2,
    spawn: 1,
    spawnRest: 1,
    startMove: 1,
    startMoveModificator: 1,
    stopMove: 1,
    energyPerMove: 1,
    eatAdvantage: 1,
  },
  radius: 10,
  color: "#000",
  speed: 8,
  frequencyDirectionChange: 1,
  maxAge: 30,
};

startButton.addEventListener("click", (e) => {
  if (gameState === "running") {
    gameState = "paused";
    e.target.innerText = "Start";
    seedButton.disabled = false;
    petri.logCells();
    return;
  } else if (gameState === "paused") {
    gameState = "running";
    petri.animate();
    e.target.innerText = "Stop";
    seedButton.disabled = true;
  } else {
    gameState = "running";
    petri.animate();
    e.target.innerText = "Stop";
    seedButton.disabled = true;
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  }
});

seedButton.addEventListener("click", (e) => {
  if (gameState === "running") {
    return;
  } else if (gameState === "paused") {
    return;
  } else {
    let cellColor = document.getElementById("cell_color").value;
    petri.seed(cellColor);
  }
});

resetButton.addEventListener("click", (e) => {
  let inputs = document.getElementsByTagName("input");
  petri.cells = [];
  gameState = "ready";
  startButton.innerText = "Start";
  seedButton.disabled = false;
  for (let i = 0; i < inputs.length; ++i) {
    inputs[i].disabled = false;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - window.innerHeight / 6 - 30;
ctx.fillStyle = defaultConfiguration.color;

class petriDish {
  constructor(ctx, configuration) {
    this.ctx = ctx;
    this.cells = [];
    this.configuration = configuration;
    this.state = "paused";
  }

  seed(color) {
    for (let i = 0; i < this.configuration.dish.countOfCells; i++) {
      let configuration = new Configuration(
        defaultConfiguration.dish,
        defaultConfiguration.energyRules,
        defaultConfiguration.radius,
        color,
        defaultConfiguration.speed,
        defaultConfiguration.frequencyDirectionChange,
        defaultConfiguration.maxAge
      );
      configuration.x = Math.floor(Math.random() * canvas.width);
      configuration.y = Math.floor(Math.random() * canvas.height);
      configuration.direction = Math.random() * 2 * Math.PI;
      configuration.getDataFromInputs();
      this.cells.unshift(new Cell(configuration));
    }
    this.draw();
  }

  spawnCell(x, y, radius, color) {
    let configuration = {
      dish: this.configuration.dish,
      energyRules: this.configuration.energyRules,
      x: x,
      y: y,
      radius: radius,
      direction: Math.random() * 2 * Math.PI,
      color: color,
      speed: Math.floor(Math.random() * this.configuration.speed),
      frequencyDirectionChange: Math.floor(
        Math.random() * this.configuration.frequencyDirectionChange
      ),
      maxAge: this.configuration.maxAge * Math.floor(Math.random() * 10),
    };
    let cell = new Cell(configuration);
    if (cell.energy > 0 && !isNaN(cell.x) && !isNaN(cell.y)) {
      this.cells.push(cell);
    }
  }

  killCells() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].age > this.configuration.maxAge) {
        this.cells.splice(i, 1);
        i--;
      } else if (this.cells[i].status === "dead") {
        this.cells.splice(i, 1);
        i--;
      } else if (
        this.cells[i].x > canvas.width + 20 ||
        this.cells[i].x < -20 ||
        this.cells[i].y > canvas.height + 20 ||
        this.cells[i].y < -20
      ) {
        this.cells.splice(i, 1);
        i--;
      }
    }
  }

  foodchainCheck(firstCell, secondCell) {
    if (
      firstCell.energy >
      secondCell.energy + this.configuration.energyRules.eatAdvantage
    ) {
      secondCell.status = "dead";
      firstCell.energy += secondCell.energy;
    } else if (
      firstCell.energy + this.configuration.energyRules.eatAdvantage <
      secondCell.energy
    ) {
      firstCell.status = "dead";
      secondCell.energy += firstCell.energy;
    }
    return;
  }

  spawnCheck() {
    for (let i = 0; i < this.cells.length; i++) {
      if (
        this.cells[i].energy > this.cells[i].configuration.energyRules.spawn
      ) {
        this.spawnCell(
          this.cells[i].x +
            this.cells[i].radius * Math.cos(this.cells[i].direction),
          this.cells[i].y +
            this.cells[i].radius * Math.sin(this.cells[i].direction),
          this.cells[i].radius,
          this.cells[i].color
        );
        this.cells[i].energy -=
          this.cells[i].configuration.energyRules.spawnRest;
      }
    }
  }

  energyCheck() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].age++;
      if (this.cells[i].energy === 0) {
        this.cells[i].status = "dead";
      } else if (this.cells[i].speed === 0) {
        if (
          this.cells[i].energy >
          this.cells[i].configuration.energyRules.startMove *
            Math.floor(
              Math.random() *
                this.cells[i].configuration.energyRules.startMoveModificator
            )
        ) {
          this.cells[i].speed = Math.floor(
            Math.random() * this.cells[i].configuration.speed
          );
        }
        this.cells[i].energy++;
      } else {
        if (
          this.cells[i].energy >
          this.cells[i].configuration.energyRules.stopMove
        ) {
          this.cells[i].energy -=
            this.cells[i].configuration.energyRules.energyPerMove;
          if (this.cells[i].energy === 0) {
            this.cells[i].status = "dead";
          }
        } else {
          this.cells[i].speed = 0;
        }
      }
    }
  }

  draw() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw(this.ctx);
    }
  }

  update() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].update();
    }
  }

  checkCollisions() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = i + 1; j < this.cells.length; j++) {
        let [collison, distance, sumOfRadii, dx, dy] = this.cells[
          i
        ].checkCollision(this.cells[i], this.cells[j]);
        if (collison) {
          this.foodchainCheck(this.cells[i], this.cells[j]);
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.cells[i].x = this.cells[j].x + (sumOfRadii + 1) * unit_x;
          this.cells[i].y = this.cells[j].y + (sumOfRadii + 1) * unit_y;
        }
      }
    }
  }

  checkCollisionsWithBorders() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].checkCollisionWithBorders(canvas);
    }
  }

  animate() {
    if (gameState === "running") {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.energyCheck();
      if (this.cells.length < this.configuration.dish.maxPopulation) {
        this.spawnCheck();
      }
      this.update();
      this.checkCollisionsWithBorders();
      this.checkCollisions();
      this.killCells();
      this.draw();

      population.innerText = this.cells.length;

      requestAnimationFrame(this.animate.bind(this));
    } else {
      return;
    }
  }
  logCells() {
    console.log(this.cells);
  }
}

let configuration = new Configuration(
  defaultConfiguration.dish,
  defaultConfiguration.energyRules,
  defaultConfiguration.radius,
  defaultConfiguration.color,
  defaultConfiguration.speed,
  defaultConfiguration.frequencyDirectionChange,
  defaultConfiguration.maxAge
);
let petri = new petriDish(ctx, configuration);
