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
        return new Token(`or`, s);
      return new Token(`text`, s);
    });
  }
}

module.exports = Lexer;