const matchString = require('./matchString');
// Includes the entire type string
//   ?q=name:mogg
//   ?q=name:bear
const matchName = (needles, card) => {
  return matchString(needles, card.name);
};

module.exports = matchName;
