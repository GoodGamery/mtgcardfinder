const matchString = require('./matchString');
// Includes the entire type string
//   ?q=set:Unglued
//   ?q=text:"Mirrodin Pure"
const matchSet = (needles, card) => {
  return matchString(needles, card.set);
};

module.exports = matchSet;