export class Configuration {
  constructor(
    dish,
    energyRules,
    radius,
    color,
    speed,
    frequencyDirectionChange
  ) {
    this.dish = dish;
    this.energyRules = energyRules;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
    this.frequencyDirectionChange = frequencyDirectionChange;
  }

  getDataFromInputs() {
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; ++i) {
      inputs[i].disabled = true;
      if (inputs[i].value != "") {
        switch (i) {
          case 0:
            this.dish.maxPopulation = inputs[i].value;
            break;
          case 1:
            this.dish.countOfCells = inputs[i].value;
            break;
          case 2:
            this.energyRules.startEnergyModificator = inputs[i].value;
            break;
          case 3:
            this.energyRules.spawn = inputs[i].value;
            break;
          case 4:
            this.energyRules.spawnRest = inputs[i].value;
            break;
          case 5:
            this.energyRules.startMove = inputs[i].value;
            break;
          case 6:
            this.energyRules.startMoveModificator = inputs[i].value;
            break;
          case 7:
            this.energyRules.stopMove = inputs[i].value;
            break;
          case 8:
            this.energyRules.energyPerMove = inputs[i].value;
            break;
          case 8:
            this.energyRules.eatAdvantage = inputs[i].value;
            break;
          default:
            break;
        }
      }
    }
  }
}
