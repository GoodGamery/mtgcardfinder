const matchSubstring = require('./matchSubstring');
// Includes the entire type string
//   ?q=t:Legendary Enchantment Artifact
//   ?q=t:Instant Goblin
//   ?q=t:Unicorn
const matchType = (needles, card) => {
  return matchSubstring(needles, card.type);
};

module.exports = matchType;
