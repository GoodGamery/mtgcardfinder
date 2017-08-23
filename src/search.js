'use strict';

const and = require('./predicates/and');
const or = require('./predicates/or');
const not = require('./predicates/not');
const predicates = require('./predicates/');
const queryParser = require('./query-parser');

// Search interface:
//   ?q=t:"golem"+mana=5
// t:"legendary goblin" c:brm mana>1 pow>=2

function search(cardList, q, limit) {
  const predicate = getPredicateFromQuery(q);
  return take(cardList, predicate, limit);
}

function getPredicateFromQuery(q) {
  const tokens = queryParser(q);
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
          }
          break;
        case `or`:
          if (predicateList.length >= 2) {
            const a = predicateList.pop();
            const b = predicateList.pop();
            predicateList.push(or(a, b));
          }
          break;
        case `not`:
          if (predicateList.length >= 1) {
            predicateList.push(not(predicateList.pop()));
          }
          break;
      }
    }
  }
  return and.apply(null, predicateList);
}

// Returns the first n items in the list that match the predicate
function take(list, predicate, limit) {
  let results = [];
  for(let i = 0; i < list.length && results.length < limit; ++i) {
    if (predicate(list[i]))
      results.push(list[i]);
  }
  return results;
}

function getPredicate(tag, query) {
  if (predicates[tag])
    return predicates[tag].bind(null, query);
  else
    console.info(`No handler for search tag ${tag}`);
  return () => true;
}

module.exports = search;