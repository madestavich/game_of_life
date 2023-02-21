import { Cell } from "./cell.js";
import { CellConfiguration } from "./config.js";

export class Dish {
  constructor(canvas, configuration) {
    this.canvas = canvas;
    this.configuration = configuration;
    this.cells = [];
  }

  seed(x, y) {
    let cellConfiguration = new CellConfiguration(this.canvas);
    cellConfiguration.randomizeAll();
    let cell = new Cell(x, y, this, cellConfiguration);
    if (cell.energy > 0 && !isNaN(cell.x) && !isNaN(cell.y)) {
      this.cells.unshift(cell);
    }
  }

  update() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].update();
      this.cells[i].age++;
    }
  }

  drawCells(context) {
    this.cells.forEach((cell) => {
      cell.draw(context);
    });
  }

  foodchainCheck(firstCell, secondCell) {
    if (
      firstCell.energy >
      secondCell.energy + this.configuration.eatAdvantage
    ) {
      secondCell.status = "dead";
      firstCell.energy += secondCell.energy;
    } else if (
      firstCell.energy + this.configuration.eatAdvantage <
      secondCell.energy
    ) {
      firstCell.status = "dead";
      secondCell.energy += firstCell.energy;
    }
    return;
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
      this.cells[i].checkCollisionWithBorders(this.canvas);
    }
  }

  killCells() {
    for (let i = 0; i < this.cells.length; i++) {
      console.log(this.cells[i]);
      this.cells[i].age++;
      if (this.cells[i].age > this.cells[i].maxAge) {
        this.cells[i].status = "dead";
        console.log(this.cells[i]);
      }
      if (this.cells[i].status === "dead") {
        this.cells.splice(i, 1);
      } else if (
        this.cells[i].x > this.canvas.width + 20 ||
        this.cells[i].x < -20 ||
        this.cells[i].y > this.canvas.height + 20 ||
        this.cells[i].y < -20
      ) {
        this.cells.splice(i, 1);
      }
    }
  }

  spawnCheck() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].energy > this.cells[i].spawnEnergy) {
        this.seed(
          this.cells[i].x +
            this.cells[i].radius * Math.cos(this.cells[i].direction),
          this.cells[i].y +
            this.cells[i].radius * Math.sin(this.cells[i].direction)
        );
        this.cells[i].energy -= this.configuration.spawnCost;
        i++;
      }
    }
  }

  energyCheck() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].energy === 0) {
        this.cells[i].status = "dead";
      } else if (this.cells[i].energy > this.cells[i].stopMoveEnergy) {
        this.cells[i].energy -= this.cells[i].moveEnergy;
      }
    }
  }
}
