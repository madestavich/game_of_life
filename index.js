import { Cell } from "./classes/cell.js";
import { Configuration } from "./classes/config.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const population = document.getElementById("population");
const startButton = document.getElementById("start");

let defaultConfiguration = {
  dish: {
    countOfCells: 1,
    maxPopulation: 1000,
  },
  energyRules: {
    startEnergyModificator: 10,
    spawn: 17,
    spawnRest: 1,
    startMove: 6,
    startMoveModificator: 10,
    stopMove: 0,
    energyPerMove: 2,
    eatAdvantage: 6,
  },
  radius: 3,
  color: "#000",
  speed: 2,
  frequencyDirectionChange: 3,
};

startButton.addEventListener("click", (e) => {
  let configuration = new Configuration(
    defaultConfiguration.dish,
    defaultConfiguration.energyRules,
    defaultConfiguration.radius,
    defaultConfiguration.color,
    defaultConfiguration.speed,
    defaultConfiguration.frequencyDirectionChange
  );
  configuration.getDataFromInputs();
  console.log(configuration);
  let petri = new petriDish(ctx, configuration);
  petri.seed();
  petri.state = "running";
  petri.animate();
  e.target.disabled = true;
  e.target.innerText = "Stop";
});

canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - window.innerHeight / 6 - 30;
ctx.fillStyle = defaultConfiguration.color;

class petriDish {
  constructor(ctx, configuration) {
    this.ctx = ctx;
    this.cells = [];
    this.nextCells = this.cells;
    this.configuration = configuration;
    this.state = "paused";
  }

  seed() {
    for (let i = 0; i < this.configuration.dish.countOfCells; i++) {
      let configuration = {
        energyRules: this.configuration.energyRules,
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        radius: this.configuration.radius,
        direction: Math.random() * 2 * Math.PI,
        color: this.configuration.color,
        speed: Math.floor(Math.random() * this.configuration.speed),
        frequencyDirectionChange: Math.floor(
          Math.random() * this.configuration.frequencyDirectionChange
        ),
      };
      this.cells.unshift(new Cell(configuration));
    }
  }

  spawnCell(x, y, radius, color) {
    let configuration = {
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
    };
    let cell = new Cell(configuration);
    this.cells.push(cell);
  }

  killCells() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].status === "dead") {
        this.cells.splice(i, 1);
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
      if (this.cells[i].energy > this.configuration.energyRules.spawn) {
        this.spawnCell(
          this.cells[i].x +
            this.cells[i].radius * Math.cos(this.cells[i].direction),
          this.cells[i].y +
            this.cells[i].radius * Math.sin(this.cells[i].direction),
          this.cells[i].radius,
          this.cells[i].color
        );
        this.cells[i].energy = this.configuration.energyRules.spawnRest;
      }
    }
  }

  energyCheck() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].energy === 0) {
        this.cells[i].status = "dead";
      } else if (this.cells[i].speed === 0) {
        if (
          this.cells[i].energy >
          this.configuration.energyRules.startMove *
            Math.floor(
              Math.random() *
                this.configuration.energyRules.startMoveModificator
            )
        ) {
          this.cells[i].speed = Math.floor(
            Math.random() * this.configuration.speed
          );
        }
        this.cells[i].energy++;
      } else {
        if (this.cells[i].energy > this.configuration.energyRules.stopMove) {
          this.cells[i].energy -= this.configuration.energyRules.energyPerMove;
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

  animate(state) {
    if (state === "running") {
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
    }
  }
}
