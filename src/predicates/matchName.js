const matchSubstringWord = require('./matchSubstringWord');
// Includes the entire type string
//   ?q=name:mogg
//   ?q=name:bear
const matchName = (needles, card) => {
  return matchSubstringWord(needles, card.name);
};

module.exports = matchName;
