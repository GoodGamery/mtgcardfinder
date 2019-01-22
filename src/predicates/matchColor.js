
// Note: This is color, not color identity
// searchProp: "!wubrgm"
// ! = exclude unselected
// m = require multicolored

const COLOR_CODES = {
  "!": `Exclude`,
  w: `W`,
  u: `U`,
  b: `B`,
  r: `R`,
  g: `G`,
  m: `Multicolor`
};

const matchColor = (searchProp, card) => {
  if (!card.colors)
    return false;

  if (!searchProp || searchProp.length === 0)
    return false;

  // Parse options out of search prop
  let options = {};
  let numColorOptions = 0;
  searchProp.split(``)
    .map(c => COLOR_CODES[c])
    .forEach(code => {
      options[code] = true;
      if (code !== `Exclude` && code !== `Multicolor`)
        ++numColorOptions;
  });
  const exclude = options.Exclude;  // Exclude unselected colors
  const multi = options.Multicolor; // Require multicolor

  const matches = card.colors.map(color => options[color]);
  const numMatches = matches.filter(a => a).length;
  const numMatchesExpected = matches.length;

  if (!exclude && !multi) {
    return matches.filter(a => a).length > 0;
  }

  if (exclude && !multi) {
    return matches.filter(a => !a).length === 0;
  }

  if (!exclude && multi) {
    return card.colors.length > 1
      && matches.filter(a => a === true).length > 0;
  }

  if (exclude && multi) {
    return numMatches === numColorOptions
      && numMatches === numMatchesExpected
      && card.colors.length > 1
      && matches.filter(a => a === false).length === 0;
  }

  return false;
};

module.exports = matchColor;
