const queryParser = require('./query-parser');
const compilePredicates = require('./predicates/compile-predicates');
const Term = require('./parser/term');

// Search interface:
//   ?q=t:"golem"+mana=5
//   ?q=t:"legendary goblin" c:brm mana>1 pow>=2

function search(cardList, q, limit) {
  const tokens = queryParser(q);
  const overriddenTokens = applyOverrides(tokens);
  const predicate = compilePredicates(overriddenTokens);
  return take(cardList, predicate, limit);
}

function applyOverrides(tokens) {
  // If there are no layout tokens, add a default 'actualCards' one
  const layoutTokens = tokens.filter(t => t.tag === `layout`);
  if (layoutTokens.length === 0) {
    return tokens.concat(new Term(`actualCards`, `true`));
  }
  return tokens;
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