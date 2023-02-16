export class Cell {
  constructor(configuration) {
    this.configuration = configuration;
    this.x = configuration.x;
    this.y = configuration.y;
    this.radius = configuration.radius;
    this.direction = configuration.direction;
    this.color = configuration.color;
    this.speed = configuration.speed;
    this.frequencyDirectionChange = configuration.frequencyDirectionChange;
    this.updateCounter = 0;
    this.energy = Math.floor(
      Math.random() * configuration.energyRules.startEnergyModificator
    );
    this.status = "alive";
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  update() {
    if (this.frequencyDirectionChange === this.updateCounter) {
      this.updateCounter = 0;
      this.direction = Math.random() * 2 * Math.PI;
      this.x += this.speed * Math.cos(this.direction);
      this.y += this.speed * Math.sin(this.direction);
    }
    this.x += this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sin(this.direction);
    this.updateCounter++;
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
}
