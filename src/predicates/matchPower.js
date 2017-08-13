const matchNumber = require('./matchNumber');

const matchPower = (searchProp, card) => {
  return matchNumber(searchProp, Number(card.power));
};

module.exports = matchPower;
