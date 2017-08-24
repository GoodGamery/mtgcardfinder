const and = require('./and');
const or = require('./or');
const not = require('./not');
const Predicates = require('./');

class PredicateException {
  constructor(message) {
    this.code = 400;
    this.message = message;
  }

  toString() {
    return `${this.code}: ${this.message}`;
  }
}

function compilePredicates(tokens) {
  // Combine predicates
  let predicateList = [];
  for(let i = 0; i < tokens.length; ++i) {
    let token = tokens[i];
    if (tokens[i].type === `term`) {
      predicateList.push(getPredicate(token.tag, token.query));
    } else if (token.type === `operator`) {
      switch(token.operator) {
        case `and`:
          if (predicateList.length >= 2) {
            const a = predicateList.pop();
            const b = predicateList.pop();
            predicateList.push(and(a, b));
          } else {
            throw new PredicateException(`Malformed query: "and" may only be between two search terms`);
          }
          break;
        case `or`:
          if (predicateList.length >= 2) {
            const a = predicateList.pop();
            const b = predicateList.pop();
            predicateList.push(or(a, b));
          } else {
            throw new PredicateException(`Malformed query: "or" may only be between two search terms`);
          }
          break;
        case `not`:
          if (predicateList.length >= 1) {
            predicateList.push(not(predicateList.pop()));
          } else {
            throw new PredicateException(`Malformed query: "not" may only be before a search term`);
          }
          break;
      }
    }
  }
  return and.apply(null, predicateList);
}

function getPredicate(tag, query) {
  if (Predicates[tag])
    return Predicates[tag].bind(null, query);
  else
    console.info(`No handler for search tag ${tag}`);
  return () => true;
}

module.exports = compilePredicates;