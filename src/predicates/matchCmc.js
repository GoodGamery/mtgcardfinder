const matchNumber = require('./matchNumber');

const matchCmc = (searchProp, card) => {
  return matchNumber(searchProp, card.cmc);
};

module.exports = matchCmc;
