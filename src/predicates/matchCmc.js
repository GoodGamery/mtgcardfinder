const matchNumber = require('./matchNumber');

const matchCmc = (searchProp, card) => {
  return matchNumber(searchProp, card.convertedManaCost);
};

module.exports = matchCmc;
