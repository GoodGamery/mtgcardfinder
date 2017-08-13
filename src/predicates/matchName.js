const matchSubstring = require('./matchSubstring');
// Includes the entire type string
//   ?q=name:mogg
//   ?q=name:bear
const matchName = (needles, card) => {
  return matchSubstring(needles, card.name);
};

module.exports = matchName;
