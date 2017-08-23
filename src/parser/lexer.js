const Token = require('./token');
class Lexer {
  static tokenize(input) {
    const stringTokens = input
      .split(/( )|(:)|(")/g)
      .filter(text => text);
    return stringTokens.map(s => {
      if (s === `:`)
        return new Token(`colon`, s);
      if (s === `"`)
        return new Token(`quote`, s);
      if (s === ` `)
        return new Token(`space`, s);
      if (s === `or`)
        return new Token(`operator`, `or`);
      if (s === `and`)
        return new Token(`operator`, `or`);
      if (s === `not`)
        return new Token(`operator`, `or`);

      return new Token(`text`, s);
    });
  }
}

module.exports = Lexer;