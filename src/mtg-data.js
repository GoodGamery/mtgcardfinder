'use strict';
const _ = require('lodash');
const allSets = require('../data/AllSets.json');
const goofs = require('../data/goofs.json');
const multiverseUrl = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=';

const cardListFull = _.flatMap(allSets, (set) => set.cards);
const cardList = _.map(cardListFull, (card) =>
  Object.assign({}, card, {
    imageUrl: card.multiverseid ? `${multiverseUrl}${card.multiverseid}` : null
  })
);

let normalizeName = (name) => {
  return name.split(`//`)[0].toLowerCase().trim();
};

let cardMap = {};
cardList.forEach(card => {
  const name = normalizeName(card.name);
  if (!cardMap[name] || card.multiverseid)
    cardMap[name] = card;
});

console.log(`Cards loaded: ${cardList.length}`);

function getCardFromQuery(query) {
  const name = query.card;
  const useGoof = query.goof !== undefined;
  const normalizedName = normalizeName(name);
  if (useGoof && goofs && goofs[normalizedName])
    return Object.assign({}, cardMap[normalizedName], goofs[normalizedName]);
  return cardMap[normalizedName];
}

function getCard(name, useGoof) {
  const normalizedName = normalizeName(name);
  if (useGoof && goofs && goofs[normalizedName])
    return Object.assign({}, cardMap[normalizedName], goofs[normalizedName]);
  return cardMap[normalizedName];
}

module.exports = {
  cardMap,
  getCard,
  getCardFromQuery
};
