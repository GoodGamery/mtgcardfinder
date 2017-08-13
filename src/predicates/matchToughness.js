const matchNumber = require('./matchNumber');

const matchToughness = (searchProp, card) => {
  return matchNumber(searchProp, card.toughness);
};

module.exports = matchToughness;
