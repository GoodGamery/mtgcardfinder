const matchNumber = require('./matchNumber');

const matchToughness = (searchProp, card) => {
  return matchNumber(searchProp, Number(card.toughness));
};

module.exports = matchToughness;
