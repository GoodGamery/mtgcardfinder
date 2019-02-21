const matchString = require('./matchString');
// Uses three-letter codes as listed in https://mtgjson.com/json/SetCodes.json
//   ?q=code:NPH
//   ?q=code:BOK
const matchCode = (needle, card) => {
  return matchString(needle, card.code);
};

module.exports = matchCode;