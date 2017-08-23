const queryParser = require('./query-parser');
const compilePredicates = require('./predicates/compile-predicates');

// Search interface:
//   ?q=t:"golem"+mana=5
//   ?q=t:"legendary goblin" c:brm mana>1 pow>=2

function search(cardList, q, limit) {
  const tokens = queryParser(q);
  const predicate = compilePredicates(tokens);
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


module.exports = search;