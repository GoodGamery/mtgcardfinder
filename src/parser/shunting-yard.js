const Operator = require('./operator');

class ShuntingYard {
  static run(inputTokens) {
    const tokens = ShuntingYard.addAutoAnds(inputTokens);
    let output = [];
    let stack = [];
    let i = 0;
    while (i < tokens.length) {
      let token = tokens[i++];
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
            if (tokenStack.precedence < token.precedence && tokenStack.associativity === Operator.prototype.left) {
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

  static addAutoAnds(input) {
    let output = [];
    let prevType = null;
    for(let i = 0; i < input.length; ++i) {
      let token =  input[i];
      // If current and last are both term tokens, emit "and"
      if (prevType === `term` && (token.type === `term` || token.unary)) {
        output.push(new Operator(`autoAnd`));
      }
      // emit the current token
      output.push(token);
      // Store previous token type
      prevType = token.type;
    }
    return output;
  }
}

module.exports = ShuntingYard;