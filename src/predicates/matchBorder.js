const matchString = require('./matchString');

// black, white, silver
const matchBorder = (needles, card) => {
  return matchString(needles, card.borderColor);
};

module.exports = matchBorder;