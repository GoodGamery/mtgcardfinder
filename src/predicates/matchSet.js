const matchSubstring = require('./matchSubstring');
// Includes the entire type string
//   ?q=set:Unglued
//   ?q=text:"Mirrodin Pure"
const matchSet = (needles, card) => {
  return matchSubstring(needles, card.set);
};

module.exports = matchSet;