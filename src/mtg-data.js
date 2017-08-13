'use strict';
const _ = require('lodash');
const allSets = require('../data/AllSets.json');
const goofs = require('../data/goofs.json');
const search = require('./search');

const multiverseUrl = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=';

const cardListOriginal = _.flatMap(allSets, (set) => set.cards);
const cardListEnhanced = _.map(cardListOriginal, (card) =>
  Object.assign({}, card, {
    imageUrl: card.multiverseid ? `${multiverseUrl}${card.multiverseid}` : undefined
  })
);

let normalizeName = (name) => {
  return name
    .split(`//`)[0] // For split cards, look at only the first portion
    .toLowerCase()  // Always lower case
    .trim();        // No trailing spaces
};

const compareCardsForSuitability = (a, b) => {
  if (a === undefined)    return b;
  if (b === undefined)    return a;
  if (a.imageUrl === undefined)    return b;
  if (b.imageUrl === undefined)    return a;
  if (a.rarity === `Special`) return b;
  if (b.rarity === `Special`) return a;
  return (a.multiverseid > b.multiverseid) ? a : b;
};

let cardMap = {};
cardListEnhanced.forEach(card => {
  const name = normalizeName(card.name);
  cardMap[name] = compareCardsForSuitability(cardMap[name], card);
});

// Deduped card list
const cardList = Object.keys(cardMap).map(k => cardMap[k]);

console.log(`Cards loaded: ${cardList.length}`);

function getCardFromQuery(query) {
  const searchQuery = query.q || ``;
  const name = query.card || ``;
  const useGoof = query.goof !== undefined;
  const normalizedName = normalizeName(name);
  if (searchQuery)
    return getCardsBySearch(searchQuery, 1)[0];
  if (useGoof && goofs && goofs[normalizedName])
    return Object.assign({}, cardMap[normalizedName], goofs[normalizedName]);
  return cardMap[normalizedName];
}

function getCardsFromQuery(query, limit) {
  let searchLimit = limit || 1;
  const searchQuery = query.q || ``;
  const name = query.card || ``;
  const useGoof = query.goof !== undefined;
  const normalizedName = normalizeName(name);
  // Use search query
  if (searchQuery)
    return getCardsBySearch(searchQuery, searchLimit);
  // Use exact card search
  let result = cardMap[normalizedName];
  if (useGoof && goofs && goofs[normalizedName])
    result = Object.assign({}, cardMap[normalizedName], goofs[normalizedName]);
  if (result)
    return [result];
  return undefined;
}

function getCard(name, useGoof) {
  const normalizedName = normalizeName(name);
  if (useGoof && goofs && goofs[normalizedName])
    return Object.assign({}, cardMap[normalizedName], goofs[normalizedName]);
  return cardMap[normalizedName];
}

function getCardsBySearch(q, limit) {
  return search(cardList, q, limit);
}

module.exports = {
  cardMap,
  getCard,
  getCardFromQuery,
  getCardsFromQuery
};
