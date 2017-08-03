'use strict';
const _ = require('lodash');
const allSets = require('../data/AllSets.json');
const multiverseUrl = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=';

const cardListFull = _.flatMap(allSets, (set) => set.cards);
const cardList = _.map(cardListFull, (card) => ({
    name: card.name,
    multiverseid: card.multiverseid,
    imageUrl: `${multiverseUrl}${card.multiverseid}`,
}));

let normalizeName = (name) => {
    return name.split(`//`)[0].toLowerCase().trim();
};

let cardMap = {};
cardList.forEach(card => {
    cardMap[normalizeName(card.name)] = card;
});

console.log(`Cards loaded: ${cardList.length}`);

function getCard(name) {
    return cardMap[normalizeName(name)];
}

module.exports = {
    cardMap: cardMap,
    getCard: getCard
};
