export class CellConfiguration {
  constructor(
    canvas,
    radius = 4,
    direction = Math.random() * 2 * Math.PI,
    directionChange = 5,
    speed = 1,
    maxSpeed = 1,
    energy = 6,
    spawnEnergy = 4,
    moveEnergy = 1,
    startMoveEnergy = 1,
    stopMoveEnergy = 0,
    color = "#000000",
    seed = 0,
    maxCells = 100,
    maxAge = 100,
    status = "alive"
  ) {
    this.canvas = canvas;
    this.radius = radius;
    this.direction = direction;
    this.directionChange = directionChange;
    this.speed = speed;
    this.maxSpeed = maxSpeed;
    this.energy = energy;
    this.spawnEnergy = spawnEnergy;
    this.moveEnergy = moveEnergy;
    this.startMoveEnergy = startMoveEnergy;
    this.stopMoveEnergy = stopMoveEnergy;
    this.color = color;
    this.seed = seed;
    this.maxCells = maxCells;
    this.maxAge = maxAge;
    this.status = status;
  }

  randomizeAll() {
    this.x = Math.floor(Math.random() * this.canvas.width);
    this.y = Math.floor(Math.random() * this.canvas.height);
    this.direction = Math.random() * 2 * Math.PI;
    this.radius = Math.floor(Math.random() * 5) + 1;
    this.directionChange = Math.floor(Math.random() * 100);
    this.speed = Math.floor(Math.random() * 10);
    this.maxSpeed = Math.floor(Math.random() * 20);
    this.energy = Math.floor(Math.random() * 10);
    this.spawnEnergy = Math.floor(Math.random() * 10);
    this.moveEnergy = Math.floor(Math.random() * 10);
    this.startMoveEnergy = Math.floor(Math.random() * 100);
    this.stopMoveEnergy = Math.floor(Math.random() * 100);
    // this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.seed = Math.floor(Math.random() * 10000);
    this.maxCells = Math.floor(Math.random() * 500);
    this.maxAge = Math.floor(Math.random() * 400);
  }
}

export class DishConfiguration {
  constructor(eatAdvantage = 0, spawnCost = 0, maxPopulation = 0) {
    this.eatAdvantage = eatAdvantage;
    this.spawnCost = spawnCost;
    this.maxPopulation = maxPopulation;
  }
}
