const matchString = require('./matchString');

// common, uncommon, rare, mythic, basic, special
const rarities = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',    
  mythic: 'Mythic Rare',    
  basic: 'Basic Land',
  special: 'Special'
};

const matchRarity = (needles, card) => {
  let normalizedNeedles = rarities[needles] ? '!' + rarities[needles] : 'invalid';
  return matchString(normalizedNeedles, card.rarity);
};

module.exports = matchRarity;