'use strict';

const compose = require('./compose');

// Search interface:
//   ?q=t:"golem"+mana=5
// t:"legendary goblin" c:brm mana>1 pow>=2

function search(cardList, q, limit) {
  const searchTerms = q.split(`+`);
  const predicateList = searchTerms
    .map(term => getPredicate(term));
  const predicate = compose.apply(null, predicateList);
  return take(cardList, predicate, limit);
}

function take(list, predicate, limit) {
  let results = [];
  for(let i = 0; i < list.length && results.length < limit; ++i) {
    if (predicate(list[i]))
      results.push(list[i]);
  }
  return results;
}

// Includes the entire type string
//   ?q=t:Legendary Enchantment Artifact
//   ?q=t:Instant Goblin
//   ?q=t:Unicorn
const matchType = (cardTypeString, card) => {
  const cardType = card.type.toLowerCase();
  const desiredTypes = cardTypeString.toLowerCase().split(` `);
  return !desiredTypes
    .find(t => !cardType.includes(t));
};

const matchCmc = (searchProp, card) => {
  return matchNumber(searchProp, card.cmc);
};

const matchNumber = (searchProp, cardNum) => {
  const re = /([<>=]*)(.+)/;  // "<=0.5"
  const matches = searchProp.match(re);
  if (matches.length === 3) {
    const ops = matches[1];
    const queryNum = Number(matches[2]);
    switch(ops) {
      case `>`:  return cardNum  >  queryNum;
      case `<`:  return cardNum  <  queryNum;
      case `>=`: return cardNum  >= queryNum;
      case `<=`: return cardNum  <= queryNum;
      case `=`:  return cardNum === queryNum;
      case ``:   return cardNum === queryNum;
    }
  }
  return false;
};

const handlers = {
  t: matchType,
  cmc: matchCmc
};

function getPredicate(term) {
  const parts = term.split(`:`);
  if (parts.length === 2) {
    const tag = parts[0];
    const query = parts[1];
    if (handlers[tag])
      return handlers[tag].bind(null, query);
    else
      console.info(`No handler for search tag ${tag}`);
  }
  console.info(`Bad search term: "${term}"`);
  return () => true;
}

module.exports = search;