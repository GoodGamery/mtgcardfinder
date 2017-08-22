class Operator {
  constructor(operator) {
    this.type = `operator`;
    this.operator = operator;
  }

  toString() {
    return `${this.type}=${this.operator}`;
  }
}

module.exports = Operator;