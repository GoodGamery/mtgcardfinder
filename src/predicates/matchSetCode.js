const matchString = require('./matchString');
// Uses three-letter codes as listed in https://mtgjson.com/json/SetCodes.json
//   ?q=code:NPH
//   ?q=code:BOK
const matchCode = (needles, card) => {
  return matchString(needles, card.code);
};

module.exports = matchCode;