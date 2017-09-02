const matchString = require('./matchString');
// Includes the entire type string
//   ?q=text:shuffle
//   ?q=text:"gain life"
const matchText = (needles, card) => {
  return matchString(needles, card.text);
};

module.exports = matchText;