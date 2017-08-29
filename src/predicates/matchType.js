const matchSubstringWord = require('./matchSubstringWord');
// Includes the entire type string
//   ?q=t:Legendary Enchantment Artifact
//   ?q=t:Instant Goblin
//   ?q=t:Unicorn
const matchType = (needles, card) => {
  return matchSubstringWord(needles, card.type);
};

module.exports = matchType;
