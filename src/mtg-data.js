const _ = require('lodash');
const goofs = require('../data/goofs.json');
const search = require('./search');
const shuffle = require('./shuffle');

const MULTIVERSE_URL = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=';
const RANDOM = `random`;

class MtgData {
  constructor(allSets) {
    this.allSets = allSets;

    const cardListOriginal = _.flatMap(allSets, set => {
      set.cards.forEach(card => card.set = set.name);
      return set.cards;
    });

    const cardListEnhanced = _.map(cardListOriginal, (card) =>
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
    cardListEnhanced.forEach(card => {
      const name = MtgData.normalizeName(card.name);
      this.cardMap[name] = compareCardsForSuitability(this.cardMap[name], card);
    });

    // Deduped card list
    this.cardList = Object.keys(this.cardMap).map(k => this.cardMap[k]);

    console.log(`Cards loaded: ${this.cardList.length}`);
  }

  static normalizeName(name) {
    return name
      .split(`//`)[0] // For split cards, look at only the first portion
      .toLowerCase()  // Always lower case
      .trim();        // No trailing spaces
  }

  getSingleCardFromQuery(query) {
    const searchQuery = query.q || ``;
    const name = query.card || ``;
    const useGoof = query.goof !== undefined;
    const normalizedName = MtgData.normalizeName(name);
    const sort = query.sort || `none`;
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
    return this.cardMap[normalizedName];
  }

  getCardsFromQuery(query, limit) {
    const sort = query.sort || `none`;
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
      return search(listToSearch, searchQuery, searchLimit);
    }
    // Use exact card search
    let result = this.cardMap[normalizedName];
    if (useGoof && goofs && goofs[normalizedName])
      result = Object.assign({}, this.cardMap[normalizedName], goofs[normalizedName]);
    if (result)
      return [result];
    return undefined;
  }

  getCardMap() {
    return this.cardMap;
  }
}

module.exports = MtgData;
