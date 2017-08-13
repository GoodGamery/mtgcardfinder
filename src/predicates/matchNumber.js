const matchNumber = (searchProp, cardNum) => {
  if (cardNum === undefined)
    return false;
  const re = /([<>=]*)(.+)/;  // "<=0.5"
  const matches = searchProp.match(re);
  if (matches.length === 3) {
    const ops = matches[1];
    const queryNum = Number(matches[2]);
    switch(ops) {
      case `>`:  return cardNum  >  queryNum;
      case `<`:  return cardNum  <  queryNum;
      case `>=`: return cardNum  >= queryNum;
      case `<=`: return cardNum  <= queryNum;
      case `=`:  return cardNum === queryNum;
      case ``:   return cardNum === queryNum;
    }
  }
  return false;
};

module.exports = matchNumber;
