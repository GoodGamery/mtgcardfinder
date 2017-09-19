const queryParser = require('./query-parser');
const compilePredicates = require('./predicates/compile-predicates');
const Term = require('./parser/term');

// Search interface:
//   ?q=t:"golem"+mana=5
//   ?q=t:"legendary goblin" c:brm mana>1 pow>=2

function search(cardList, q, limit, unique) {
  const tokens = queryParser(q);
  const overriddenTokens = applyOverrides(tokens);
  const predicate = compilePredicates(overriddenTokens);
  return take(cardList, predicate, limit, unique);
}

function applyOverrides(inputTokens) {
  // Require all cards to have images
  let tokens = inputTokens.concat(new Term(`requireImage`, `true`));

  // If there are no layout tokens, add a default 'actualCards' one to exclude planes, schemes, etc
  const layoutTokens = tokens.filter(t => t.tag === `layout`);
  if (layoutTokens.length === 0) {
    tokens = tokens.concat(new Term(`actualCards`, `true`));
  }

  return tokens;
}

// Returns the first n items in the list that match the predicate
function take(list, predicate, limit, unique) {
  let results = [];
  let resultNameMap = {};
  for(let i = 0; i < list.length && results.length < limit; ++i) {
    const card = list[i];
    // Apply predicates
    if (predicate(card)) {
      if (unique && resultNameMap[card.name]) {
        // Skipping duplicate card
      } else {
        resultNameMap[card.name] = true;
        results.push(card);
      }
    }
  }
  return results;
}


module.exports = search;