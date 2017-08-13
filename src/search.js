'use strict';

const and = require('./predicates/and');
const predicates = require('./predicates/');

// Search interface:
//   ?q=t:"golem"+mana=5
// t:"legendary goblin" c:brm mana>1 pow>=2

function search(cardList, q, limit) {
  const searchTerms = q.split(` `);
  const predicateList = searchTerms
    .map(term => getPredicate(term));
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

function getPredicate(term) {
  const parts = term.split(`:`);
  if (parts.length === 2) {
    const tag = parts[0];
    const query = parts[1];
    if (predicates[tag])
      return predicates[tag].bind(null, query);
    else
      console.info(`No handler for search tag ${tag}`);
  }
  console.info(`Bad search term: "${term}"`);
  return () => true;
}

module.exports = search;