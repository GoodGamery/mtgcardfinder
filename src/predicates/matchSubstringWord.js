// needle is a string that should exist in
// the haystack. Return true if it does.
// Requires whole words, won't match a substring inside of another word.
const matchSubstringWord = (needle, haystack) => {
  const reg = new RegExp(`(^|\\W)${needle}(\\W|$)`, `i`);
  return haystack && needle && reg.test(haystack);
};

module.exports = matchSubstringWord;