const Lexer = require('./parser/lexer');
const StateDef = require('./parser/state-def');
const Term = require('./parser/term');
const Operator = require('./parser/operator');

const queryParser = (q) => {
  const tokens = Lexer.tokenize(q);
  return parse(tokens);
};

const TAG    = new StateDef(0, `TAG`);
const COLON  = new StateDef(1, `COLON`);
const QUERY  = new StateDef(2, `QUERY`);
const S_QQUERY = new StateDef(3, `QUOTED QUERY`);
const S_ERR    = new StateDef(4, `ERROR`);

const debugLog = (text) => {
  if (process.env.NODE_ENV === `test`)
    console.log(text);
};

class ParseState {
  constructor() {
    this.tag = ``;
    this.query = [];
    this.terms = [];
    this.state = TAG;
  }

  resetTagAndQuery() {
    this.tag = ``;
    this.query = [];
  }

  addText(text) {
    this.query.push(text);
  }

  addOperator(operator) {
    this.terms.push(new Operator(operator));
    this.resetTagAndQuery();
  }

  setTag(text) {
    this.tag = text;
  }

  finish() {
    this.terms.push(new Term(this.tag, this.query.join(``)));
    this.resetTagAndQuery();
  }
}

const err = (parseState, token) => {
  debugLog(`!err : Can't process token ${token.type} when in state ${parseState.state}`);
  return S_ERR;
};

const text = (parseState, token) => {
  debugLog(`!text : "${token.value}"`);
  parseState.addText(token.value);
  return parseState.state;
};

const finish = (parseState) => {
  debugLog(`!finish : ${parseState.terms.join('')}`);
  parseState.finish();
  return TAG;
};

const textFin = (parseState, token) => {
  debugLog(`!textFin : "${token.value}"`);
  parseState.addText(token.value);
  parseState.finish();
  return TAG;
};

const op = (parseState, token) => {
  debugLog(`!op : ${token.value}`);
  parseState.addOperator(token.value);
  return TAG;
};

const tag = (parseState, token) => {
  debugLog(`!tag : "${token.value}"`);
  parseState.setTag(token.value);
  return COLON;
};

const next = (parseState) => {
  debugLog(`!next : ${parseState.state}`);
  return parseState.state;
};

const parserTransitionMatrix =
  //          TAG   COLON    QUERY     QQUERY   ERR
  {    colon: [  err,  QUERY,   err,      text,    S_ERR]
  ,    quote: [  err,  err,     S_QQUERY, finish,  S_ERR]
  ,    space: [  next, next,    next,     text,    S_ERR]
  , operator: [  op,   err,     textFin,  text,    S_ERR]
  ,     text: [  tag,  err,     textFin,  text,    S_ERR]
};

const parse = (tokens) => {
  let index = 0;
  // Starting state of parser
  let parseState = new ParseState();

  while(index < tokens.length && parseState.state !== S_ERR) {
    const token = tokens[index];
    debugLog(`> Token: ${token.type}="${token.value}"`);
    const next = parserTransitionMatrix[token.type][parseState.state.value];
    if (typeof next === `function`) {
      parseState.state = next(parseState, token);
    } else {
      debugLog(`!next: ${next}`);
      parseState.state = next;
    }
    ++index;
  }

  if (parseState.state === S_ERR) {
    debugLog(`Parser was in error state after parsing tokens.`);
  }

  return parseState.terms;
};

module.exports = queryParser;