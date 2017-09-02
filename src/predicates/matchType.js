const matchString = require('./matchString');
// Includes the entire type string
//   ?q=t:Legendary Enchantment Artifact
//   ?q=t:Instant Goblin
//   ?q=t:Unicorn
const matchType = (needles, card) => {
  return matchString(needles, card.type);
};

module.exports = matchType;
