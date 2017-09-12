const matchString = require('./matchString');
// Includes the entire type string
//   ?q=layout:normal
//   ?q=layout:token
const matchLayout = (needles, card) => {
  return matchString(needles, card.layout);
};

module.exports = matchLayout;
