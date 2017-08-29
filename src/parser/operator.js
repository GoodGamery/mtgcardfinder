class Operator {
  constructor(operator) {
    this.type = `operator`;
    this.operator = operator;
    this.unary = false;
    switch(operator) {
      case `(`:
      case `)`:
        this.type = `paren`;
        break;
      case `not`:
        this.precedence = 1;
        this.associativity = Operator.prototype.right;
        this.unary = true;
        break;
      case `or`:
        this.precedence = 2;
        this.associativity = Operator.prototype.left;
        break;
      case `and`:
        this.precedence = 2;
        this.associativity = Operator.prototype.left;
        break;
      case `autoAnd`:
        this.operator = `and`;
        this.precedence = 10;
        this.associativity = Operator.prototype.left;
        break;
    }
  }

  toString() {
    return `${this.type}=${this.operator}`;
  }
}

Operator.prototype.left = Symbol(`left`);
Operator.prototype.right = Symbol(`right`);

module.exports = Operator;