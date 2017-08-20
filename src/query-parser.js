
const queryParser = (q) => {
  const tokens = tokenize(q);
  return parse(tokens);
};

const tokenize = (sourceString) => {
  const stringTokens = sourceString
    .split(/( )|(:)|(")/g)
    .filter(text => text);
  return stringTokens.map(s => {
    if (s === `:`)
      return { type: `colon`, value: s };
    if (s === `"`)
      return { type: `quote`, value: s };
    if (s === " ")
      return { type: `space`, value: s };
    return { type: `text`, value: s };
  });
};

const STATE_TAG = Symbol(`TAG`);
const STATE_COLON = Symbol(`COLON`);
const STATE_QUERY = Symbol(`QUERY`);
const STATE_QUERY_QUOTE = Symbol(`QUERY_QUOTE`);
const STATE_ERROR = Symbol(`ERROR`);

const processTag = (token, state) => {
  switch(token.type) {
    case `colon`:
      console.log(`Expecting a tag, not a colon.`);
      return STATE_ERROR;
    case `quote`:
      console.log(`Expecting a tag, not a quote.`);
      return STATE_ERROR;
    case `space`: // Skip spaces before tags
      return STATE_TAG;
    case `text`:
      state.setTag(token.value);
      return STATE_COLON;
  }
};

const processColon = (token, state) => {
  switch(token.type) {
    case `colon`:
      return STATE_QUERY;

    case `quote`:
      console.log(`Didn't expect quote after query tag "${state.tag}". There should be a colon here.`);
      return STATE_ERROR;

    case `space`: // Skip spaces before the colon
      return STATE_COLON;

    case `text`:
      console.log(`Didn't expect text after query tag "${state.tag}". There should be a colon here.`);
      return STATE_ERROR;
  }
};

const processQuery = (token, state) => {
  switch(token.type) {
    case `colon`:
      console.log(`Didn't expect another colon after the colon. There should be a quote or text here.`);
      return STATE_ERROR;

    case `space`: // Skip spaces after the colon
      return STATE_QUERY;

    case `quote`: // If the first token of a query is a quote, this is a quoted query
      return STATE_QUERY_QUOTE;

    case `text`: // If the first token of a query is text, then it's a single-text query
      state.addText(token.value);
      state.finish();
      return STATE_TAG;
  }
};

const processQueryQuote = (token, state) => {
  switch(token.type) {
    case `quote`:
      state.finish();
      return STATE_TAG;

    default:  // Anything other than a quote is interpreted as text
      state.addText(token.value);
      return STATE_QUERY_QUOTE;
  }
};

let dispatch = {};
dispatch[STATE_TAG] = processTag;
dispatch[STATE_COLON] = processColon;
dispatch[STATE_QUERY] = processQuery;
dispatch[STATE_QUERY_QUOTE] = processQueryQuote;

class ParseState {
  constructor() {
    this.tag = ``;
    this.query = [];
    this.terms = [];
  }

  resetState() {
    this.tag = ``;
    this.query = [];
  }

  addText(text) {
    this.query.push(text);
  }

  setTag(text) {
    this.tag = text;
  }

  finish() {
    this.terms.push({
      tag: this.tag,
      query: this.query.join(``)
    });
    this.resetState();
  }
}


const parse = (tokens) => {
  let index = 0;
  let parseState = STATE_TAG;

  // Starting state of parser
  let state = new ParseState();

  while(index < tokens.length && parseState !== STATE_ERROR) {
    const token = tokens[index];
    parseState = dispatch[parseState](token, state);
    ++index;
  }

  return state.terms;
};

module.exports = queryParser;