class Operator {
  constructor(operator) {
    this.type = `operator`;
    this.operator = operator;
    this.left = Symbol(`left`);
    this.right = Symbol(`right`);
    this.unary = false;
    switch(operator) {
      case `not`:
        this.precendence = 3;
        this.associativity = this.right;
        this.unary = true;
        break;
      case `or`:
        this.precedence = 2;
        this.associativity = this.left;
        break;
      case `and`:
        this.precendence = 1;
        this.associativity = this.left;
        break;
    }
  }

  toString() {
    return `${this.type}=${this.operator}`;
  }
}

module.exports = Operator;