const _ = require('lodash');
const goofs = require('../data/goofs.json');
const search = require('./search');
const shuffle = require('./shuffle');

const MULTIVERSE_URL = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=';
const RANDOM = `random`;

class MtgData {
  constructor(allSets) {
    const cardListOriginal = _.flatMap(allSets, set => {
      set.cards.forEach(card => {
        card.set = set.name;
        card.code = set.code;
        card.border = card.border || set.border
      });    

      return set.cards;
    });

    this.cardList = _.map(cardListOriginal, (card) =>
      Object.assign({}, card, {
        imageUrl: card.multiverseid ? `${MULTIVERSE_URL}${card.multiverseid}` : undefined
      })
    );

    const compareCardsForSuitability = (a, b) => {
      if (a === undefined)    return b;
      if (b === undefined)    return a;
      if (a.imageUrl === undefined)    return b;
      if (b.imageUrl === undefined)    return a;
      if (a.rarity === `Special`) return b;
      if (b.rarity === `Special`) return a;
      return (a.multiverseid > b.multiverseid) ? a : b;
    };

    this.cardMap = {};
    this.cardList.forEach(card => {
      const name = MtgData.normalizeName(card.name);
      this.cardMap[name] = compareCardsForSuitability(this.cardMap[name], card);
    });

    console.log(`Cards loaded: ${this.cardList.length}`);
  }

  static normalizeName(name) {
    return name
      .split(`//`)[0] // For split cards, look at only the first portion
      .toLowerCase()  // Always lower case
      .trim();        // No trailing spaces
  }

  getSingleCardFromQuery(query) {
    const name = query.card || ``;
    const useGoof = query.goof !== undefined;
    const normalizedName = MtgData.normalizeName(name);  
    const sort = query.sort || `none`;
    let searchQuery = query.q || ``;

    // if sort is random, use card search instead of the static card map
    if (!searchQuery && sort === RANDOM) {
      searchQuery = `name:"${normalizedName}"`;
    }

    if (searchQuery) {
      let listToSearch = this.cardList;
      if (sort === RANDOM)
        shuffle(listToSearch);
      let card = search(listToSearch, searchQuery, 1)[0];
      if (card)
        card.isRandom = sort === RANDOM;
      return card;
    }
    if (useGoof && goofs && goofs[normalizedName])
      return Object.assign({}, this.cardMap[normalizedName], goofs[normalizedName]);
    return this.getCardFromMap(normalizedName);
  }

  getCardsFromQuery(query, limit) {
    const sort = query.sort || `none`;
    const unique = query.unique === `` || query.unique || false;
    const searchLimit = limit || 1;
    const searchQuery = query.q || ``;
    const name = query.card || ``;
    const useGoof = query.goof !== undefined;
    const normalizedName = MtgData.normalizeName(name);
    // Use search query
    if (searchQuery) {
      let listToSearch = this.cardList;
      if (sort === RANDOM)
        shuffle(listToSearch);
      return search(listToSearch, searchQuery, searchLimit, unique);
    }
    // Use exact card search
    let result = this.getCardFromMap(normalizedName);
    if (useGoof && goofs && goofs[normalizedName])
      result = Object.assign({}, this.cardMap[normalizedName], goofs[normalizedName]);
    if (result)
      return [result];
    return undefined;
  }

  getCardMap() {
    return this.cardMap;
  }

  getCardFromMap(name) {
    return this.cardMap[name];
  }
}

module.exports = MtgData;
