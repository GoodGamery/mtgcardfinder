const matchString = require('./matchString');

// black, white, silver
const matchBorder = (needles, card) => {
  console.log(needles + '? ' + card.border);
  return matchString(needles, card.border);
};

module.exports = matchBorder;