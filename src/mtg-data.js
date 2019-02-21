const _ = require('lodash');
const JSONStream = require('JSONStream');
const goofs = require('../data/goofs.json');
const search = require('./search');
const shuffle = require('./shuffle');

const MULTIVERSE_URL = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseId=';
const RANDOM = `random`;
const ANY = `any`;

class MtgData {
  constructor(allSetsStream, doneCallback) {
    this.imagePrefix = MULTIVERSE_URL;
    this.cardMap = {};
    this.cardList = [];

    allSetsStream
      .pipe(JSONStream.parse([true, `cards`, {emitPath: true}]))
      .on('data', data => {
        let card = data.value;
        card.set = data.path[0];  // This used to be the set name
        card.code = data.path[0];
        card.legalities = null;
        card.foreignData = null;
        card.tcgplayerPurchaseUrl = null;
        card.tcgplayerProductId = null;
        card.variations = null;
        this.cardList.push(card);
      })
      .on('end', () => {
        this.cardList.forEach(card => {
          const name = MtgData.normalizeName(card.name);
          this.cardMap[name] = compareCardsForSuitability(this.cardMap[name], card);
        });

        console.info(`Cards loaded: ${this.cardList.length}`);
        doneCallback();
      });

    const compareCardsForSuitability = (a, b) => {
      if (a === undefined)    return b;
      if (b === undefined)    return a;
      if (a.multiverseId === undefined)    return b;
      if (b.multiverseId === undefined)    return a;
      if (a.rarity === `Special`) return b;
      if (b.rarity === `Special`) return a;
      return (a.multiverseId > b.multiverseId) ? a : b;
    };
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

    // alias for the 'code' predicate (three-letter set code)
    // for use with 'card' parameter (i.e. image search)
    const version = query.version; 

    let searchQuery = query.q || ``;

    // if sort is random or a version is requested, 
    // use card search instead of the static card map
    if (!searchQuery && (sort === RANDOM || version !== undefined)) {
      searchQuery = `name:"${normalizedName}"`;
      if (version !== ANY && version !== undefined) {
        searchQuery += ` code:${version}`;
      }
    }

    if (searchQuery) {
      let listToSearch = this.cardList;
      if (sort === RANDOM || version === ANY)
        shuffle(listToSearch);
      let card = search(listToSearch, searchQuery, 1)[0];
      if (card)
        card.isRandomOrVersioned = (sort === RANDOM) || (version !== undefined);
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

  getCardFromMap(name) {
    return this.cardMap[name];
  }
}

module.exports = MtgData;
