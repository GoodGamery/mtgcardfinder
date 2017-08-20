'use strict';

const and = require('./predicates/and');
const predicates = require('./predicates/');
const queryParser = require('./query-parser');

// Search interface:
//   ?q=t:"golem"+mana=5
// t:"legendary goblin" c:brm mana>1 pow>=2

function search(cardList, q, limit) {
  const searchTerms = queryParser(q);
  const predicateList = searchTerms.map(term => getPredicate(term.tag, term.query));
  const predicate = and.apply(null, predicateList);
  return take(cardList, predicate, limit);
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