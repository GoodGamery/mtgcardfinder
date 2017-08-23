const Operator = require('./operator');

class ShuntingYard {
  static run(input) {
    let output = [];
    let stack = [];
    let i = 0;
    while (i < input.length) {
      let token = input[i++];
      switch (token.type) {
        case `term`:
          output.push(token);
          // Place unary operators after their single terms
          if (stack.length > 0 && stack[stack.length-1].unary)
            output.push(stack.pop());
          break;
        case `operator`:
          // Grab operators off of the stack
          while (stack.length > 0) {
            let tokenStack = stack[stack.length-1];
            if (tokenStack.precedence > token.precedence && tokenStack.associativity === Operator.left) {
              output.push(stack.pop());
            } else {
              break;
            }
          }
          stack.push(token);
          break;
      }
    }

    while(stack.length > 0) {
      output.push(stack.pop());
    }

    return output;
  }
}

module.exports = ShuntingYard;