const matchString = require('./matchString');
//   ?q=actualCards:true
const matchActualCards = (needles, card) => {
  // normal, split, double, flip, aftermath
  return matchString(`normal`, card.layout)
      || matchString(`split`, card.layout)
      || matchString(`double`, card.layout)
      || matchString(`flip`, card.layout)
      || matchString(`aftermath`, card.layout)
      ;
};

module.exports = matchActualCards;
