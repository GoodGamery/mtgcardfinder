const Operator = require('./operator');

class ShuntingException {
  constructor(message) {
    this.code = 400;
    this.message = message;
  }

  toString() {
    return `${this.code}: ${this.message}`;
  }
}

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
        case `paren`:
          if (token.operator === `(`) {
            stack.push(token);
          } else if (token.operator === `)`) {
            let foundParen = false;
            while(stack.length > 0) {
              let tokenStack = stack[stack.length-1];
              if(tokenStack.operator === `(`) {
                stack.pop();
                foundParen = true;
                break;
              } else if (tokenStack.type === `operator`) {
                output.push(stack.pop());
              } else {
                break;
              }
            }

            if (!foundParen)
              throw new ShuntingException(`Missing an opening parentheses`);
          }
          break;
        case `operator`:
          // Grab operators off of the stack
          while (stack.length > 0) {
            let tokenStack = stack[stack.length-1];
            if ( tokenStack.type === `operator`
              && tokenStack.precedence <= token.precedence
              && tokenStack.associativity === Operator.prototype.left) {
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
      let op = stack.pop();
      if (op.type === `paren`)
        throw new ShuntingException(`Missing a closing parentheses`);
      output.push(op);
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