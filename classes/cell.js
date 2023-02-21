export class Cell {
  constructor(x, y, dish, configuration) {
    this.x = x;
    this.y = y;
    this.dish = dish;
    this.canvas = configuration.canvas;
    this.radius = configuration.radius;
    this.direction = configuration.direction;
    this.directionChange = configuration.directionChange;
    this.speed = configuration.speed;
    this.maxSpeed = configuration.maxSpeed;
    this.energy = configuration.energy;
    this.spawnEnergy = configuration.spawnEnergy;
    this.moveEnergy = configuration.moveEnergy;
    this.startMoveEnergy = configuration.startMoveEnergy;
    this.stopMoveEnergy = configuration.stopMoveEnergy;
    this.color = configuration.color;
    this.seed = configuration.seed;
    this.maxCells = configuration.maxCells;
    this.maxAge = configuration.maxAge;
    this.status = configuration.status;
    this.updateCounter = 0;
    this.age = 0;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }

  checkCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.radius + b.radius;
    return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
  }

  checkCollisionWithBorders(canvas) {
    if (
      this.x < this.radius * 2 ||
      this.x + this.radius > canvas.width - this.radius
    ) {
      this.direction = Math.PI - this.direction;
    }
    if (
      this.y < this.radius * 2 ||
      this.y + this.radius > canvas.height - this.radius
    ) {
      this.direction = -this.direction;
    }
  }

  update() {
    if (this.status === "dead") {
      return;
    }
    if (this.directionChange === this.updateCounter) {
      this.updateCounter = 0;
      this.direction = Math.random() * 2 * Math.PI;
      this.x += this.speed * Math.cos(this.direction);
      this.y += this.speed * Math.sin(this.direction);
    }
    this.x += this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sin(this.direction);
    this.updateCounter++;
  }
}
